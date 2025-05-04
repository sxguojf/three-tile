/**
 *@description: LOD Tile
 *@author: 郭江峰
 *@date: 2025-05-01
 */

import { BaseEvent, Box3, Camera, Frustum, Layers, Matrix4, Mesh, Object3D, Object3DEventMap, Vector3 } from "three";
import { ITileLoader } from "../loader";
import { createChildren, LODAction, LODEvaluate } from "./util";

/**
 * 最大下载线程数
 */
const THREADSNUM = 10;

/**
 * 瓦片更新参数类型
 */
export type TileUpdateParames = {
	/** 相机 */
	camera: Camera;
	/** 瓦片加载器 */
	loader: ITileLoader;
	/** 最小层级 */
	minLevel: number;
	/** 最大层级 */
	maxLevel: number;
	/** 瓦片LOD阈值 */
	LODThreshold: number;
};

/**
 * 瓦片事件映射类型
 * 为了便于使用，所有事件均由根瓦片发出
 */
export interface TTileEventMap extends Object3DEventMap {
	/** 瓦片创建事件 */
	"tile-created": BaseEvent & { tile: Tile };
	/** 瓦片加载完成事件 */
	"tile-loaded": BaseEvent & { tile: Tile };
	/** 瓦片卸载事件 */
	"tile-unload": BaseEvent & { tile: Tile };
	/** 瓦片可视状态改变事件 */
	"tile-visible-changed": BaseEvent & { tile: Tile; visible: boolean };
}

/** 临时变量 */
const tempMat4 = new Matrix4();
/** 瓦片边界盒 */
const tileBox = new Box3(new Vector3(-0.5, -0.5, 0), new Vector3(0.5, 0.5, 1));
/** 相机世界坐标 */
const cameraWorldPosition = new Vector3();
/** 场景视锥体 */
const frustum = new Frustum();
/** 可视图层 */
const visibleLayer = new Layers();
visibleLayer.set(0);

/**
 * 动态LOD（DLOD）地图瓦片类，用于表示地图中的一块瓦片
 * 以四叉树方式进行管理，通过判断摄像机与瓦片的距离，动态细分或合并子瓦片。
 * 一块瓦片包含1个地形模型Mesh，当其为父瓦片时，还包含4个Tile叶子瓦片。
 */
export class Tile extends Object3D<TTileEventMap> {
	private static _downloadThreads = 0;
	/** 取得下载中的线程数量 */
	public static get downloadThreads() {
		return Tile._downloadThreads;
	}

	/** 瓦片x坐标 */
	public readonly x: number;
	/** 瓦片y坐标 */
	public readonly y: number;
	/** 瓦片层级 */
	public readonly z: number;
	/** 是否为瓦片 */
	public readonly isTile = true;
	/** 根瓦片 */
	private _root: Tile | null = null;
	/** 瓦片模型 */
	public model: Mesh | undefined;
	/** 子瓦片 */
	public subTiles: Tile[] | undefined;

	private _maxZ = 0;
	/** 取得瓦片最高高度 */
	public get maxZ() {
		return this._maxZ;
	}

	/** 取得瓦片离摄像机距离（世界坐标系） */
	public get distToCamera() {
		const tilePos = this.position.clone().setZ(this.maxZ).applyMatrix4(this.matrixWorld);
		return cameraWorldPosition.distanceTo(tilePos);
	}

	private _sizeInWorld = -1;
	/* 瓦片在世界坐标系中的大小（对角线长度） */
	public get sizeInWorld() {
		if (this._sizeInWorld < 0) {
			const scale = this.scale;
			const lt = new Vector3(-scale.x, -scale.y, 0).applyMatrix4(this.matrixWorld);
			const rt = new Vector3(scale.x, scale.y, 0).applyMatrix4(this.matrixWorld);
			this._sizeInWorld = lt.sub(rt).length();
		}
		return this._sizeInWorld;
	}

	/** 取得瓦片是否在视锥体内 */
	public get inFrustum(): boolean {
		// 生成瓦片的虚拟包围盒
		const bounds = tileBox.clone().applyMatrix4(this.matrixWorld);
		bounds.min.setY(-300);
		bounds.max.setY(9000);
		return frustum.intersectsBox(bounds);
	}

	/** 是否为叶子瓦片 */
	public get isLeaf(): boolean {
		return !this.subTiles; // 没有子瓦片
	}

	/** 取得瓦片是否显示 */
	public get showing() {
		// return !!this.model?.visible;
		return !!this.model?.layers.test(visibleLayer);
	}

	/** 设置瓦片是否显示 */
	public set showing(value) {
		// this.model && (this.model.visible = value);
		// threejs R114 后，射线会计算与不可视对象的相交： https://github.com/mrdoob/three.js/issues/14700
		// 检测不可视瓦片会造成资源浪费，为节省资源，使用layer来控制瓦片可视和射线检测

		if (value != this.showing) {
			this.model?.layers.set(value ? 0 : 1);
			this.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: value });
		}
	}

	/** 取得瓦片是否正在加载 */
	private _isLoading = false;
	public get isLoading(): boolean {
		return this._isLoading;
	}

	/**
	 * 构造函数
	 * @param x - 瓦片X坐标，默认：0
	 * @param y - 瓦片Y坐标，默认：0
	 * @param z - 瓦片层级，默认：0
	 */
	public constructor(x = 0, y = 0, z = 0) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = `Tile ${z}-${x}-${y}`;
		// 瓦片Z轴指向天顶
		this.up.set(0, 0, 1);
		// 关闭自动更新矩阵以提高速度
		this.matrixAutoUpdate = false;
		this.matrixWorldAutoUpdate = false;
	}

	/**
	 * 瓦片不进行射线检测（其中地图模型mode进行检测）
	 */
	public raycast(): void {}

	/**
	 * 瓦片更新，该函数在每帧渲染中被调用
	 * @param params 瓦片加载参数
	 * @returns this
	 */
	public update(params: TileUpdateParames) {
		// 没有父瓦片或模型正在加载时不进行更新
		if (!this.parent || this.isLoading) {
			return this;
		}

		// 如果模型未加载 且 瓦片层级>=地图最小层级，则开始异步下载，并立即返回
		if (!this.model && this.z >= params.minLevel) {
			this._startLoad(params.loader);
			return this;
		}

		// 如果下载中的线程数量超过设定的阈值，返回
		if (Tile._downloadThreads > THREADSNUM) {
			return this;
		}

		// 如果是根瓦片，则计算一次视锥体和摄像机坐标
		if (this.z === 0) {
			this._root = this;
			const camera = params.camera;
			frustum.setFromProjectionMatrix(tempMat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
			camera.getWorldPosition(cameraWorldPosition);
		}

		// LOD
		const newTiles = this.LOD(params);
		if (newTiles) {
			this.add(...newTiles);
			this.subTiles = newTiles;
			// 手动更新子瓦片矩阵
			this.subTiles.forEach(child => {
				child.updateMatrix();
				child.updateMatrixWorld();
				this._root?.dispatchEvent({ type: "tile-created", tile: child });
			});
			return this;
		}

		// 递归更新子瓦片
		this.subTiles?.forEach(child => {
			child.update(params);
		});

		return this;
	}

	/**
	 * LOD (Level of Detail).
	 * @param threshold - LOD 阈值
	 * @returns newTiles - 新创建的子瓦片数组
	 */
	protected LOD(params: TileUpdateParames) {
		const { loader, minLevel, maxLevel, LODThreshold } = params;
		// 评估瓦片需要细化还是合并
		const action = LODEvaluate(this, minLevel, maxLevel, LODThreshold);
		let newTiles: Tile[] | undefined;
		if (action === LODAction.create) {
			// console.log("create", this.name);
			// 创建子瓦片
			newTiles = createChildren(this, loader);
		} else if (action === LODAction.remove) {
			// console.log("remove", this.name);
			// 显示当前瓦片
			this.showing = true;
			// 释放子瓦片
			this.unLoad(loader, false);
		}
		return newTiles;
	}

	/**
	 * 检查瓦片是否需要显示
	 */
	private _checkVisible() {
		const parent = this.parent;
		if (parent instanceof Tile && parent.subTiles) {
			// console.assert(parent.showing);
			// 当前瓦片的兄弟瓦片
			const subTiles = parent.subTiles;
			// 检查所有兄弟瓦片是否加载完成
			const allLoaded = subTiles.every(child => child.model);
			console.assert(subTiles.length === 4);
			// 如果所有兄弟瓦片都加载完成，显示当前瓦片，隐藏父瓦片
			subTiles.forEach(child => (child.showing = allLoaded));
			parent.showing = !allLoaded;
		}
		return this;
	}

	/**
	 * 下载瓦片数据
	 * @param loader  - 瓦片加载器
	 * @returns this
	 */
	private async _startLoad(loader: ITileLoader) {
		this._isLoading = true;
		Tile._downloadThreads++;
		const { x, y, z } = this;
		// console.log("load", this.name);
		// 加载瓦片数据，取得瓦片Mesh
		this.model = await loader.load({ x, y, z, bounds: [-Infinity, -Infinity, Infinity, Infinity] });
		this.showing = false;
		this.add(this.model);

		this.model.userData = {
			tile: this,
		};

		// 计算瓦片最大高度
		this._maxZ = this.model.geometry.boundingBox?.max.z || 0;

		// 检查瓦片是否需要显示
		this.isLeaf && this._checkVisible();
		this._isLoading = false;
		Tile._downloadThreads--;
		this._root?.dispatchEvent({ type: "tile-loaded", tile: this });

		return this.model;
	}

	/**
	 * 重新加载瓦片
	 * @returns this
	 */
	public reload(loader: ITileLoader) {
		this.unLoad(loader, true);
		return this;
	}

	/**
	 * 卸载瓦片 (包括其子瓦片)，释放资源
	 * @param loader - 瓦片加载器
	 * @param unLoadSelf - 是否卸载自身
	 * @returns this
	 */
	public unLoad(loader: ITileLoader, unLoadSelf = true) {
		// 卸载子瓦片
		if (this.subTiles) {
			this.subTiles.forEach(child => {
				child.unLoad(loader, true);
			});
			this.remove(...this.subTiles);
			this.subTiles = undefined;
		}
		// 卸载自己
		if (unLoadSelf && this.model) {
			loader.unload(this.model);
			this.model = undefined;
			this._root?.dispatchEvent({ type: "tile-unload", tile: this });
		}
		return this;
	}
}
