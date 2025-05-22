/**
 *@description: LOD Tile
 *@author: 郭江峰
 *@date: 2025-05-01
 */

import { BaseEvent, Box3, Camera, Frustum, Matrix4, Mesh, Object3D, Object3DEventMap, Raycaster, Vector3 } from "three";
import { ITileLoader } from "../loader";
import { createChildren, LODAction, LODEvaluate } from "./util";

/** 最大下载线程数 */
const THREADSNUM = 10;

/** 瓦片更新参数类型 */
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
/** 相机世界坐标 */
const cameraWorldPosition = new Vector3();
/** 场景视锥体 */
const frustum = new Frustum();
/** 瓦片包围盒(局部坐标) */
const tileBox = new Box3(new Vector3(-0.5, -0.5, 0), new Vector3(0.5, 0.5, 0));

/**
 * 动态LOD（DLOD）地图瓦片类，用于表示地图中的一块瓦片，瓦片可以包含子瓦片，以四叉树方式管理。
 */
export class Tile extends Object3D<TTileEventMap> {
	private static _downloadingThreads = 0;
	/** 取得下载中的线程数量 */
	public static get downloadingThreads() {
		return Tile._downloadingThreads;
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
	private _root?: Tile;
	/** 瓦片是否正在加载中 */
	private _isLoading = false;

	/** 瓦片实际地形包围盒（世界坐标） */
	private _bbox: Box3 | null = null;
	private get bbox() {
		if (!this._bbox) {
			this._bbox = tileBox.clone().applyMatrix4(this.matrixWorld);
		}
		return this._bbox;
	}

	/** 瓦片大包围盒（世界坐标） */
	private _bigBox: Box3 | null = null;
	private get bigBox() {
		if (!this._bigBox) {
			this._bigBox = this.bbox.clone();
			this._bigBox.min.setY(-300);
			this._bigBox.max.setY(9000);
			return this._bigBox;
		} else {
			return this._bigBox;
		}
	}

	/** 瓦片模型 */
	private _model: Mesh | undefined;
	public get model() {
		return this._model;
	}
	/** 子瓦片 */
	private _subTiles: Tile[] | undefined;
	public get subTiles() {
		return this._subTiles;
	}

	/** 取得瓦片离摄像机距离（世界坐标系） */
	public get distToCamera() {
		const tilePos = this.position
			.clone()
			.setZ(this.bbox.max.z || 0)
			.applyMatrix4(this.matrixWorld);
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

	/** 瓦片是否在视锥体内 */
	public get inFrustum(): boolean {
		return !this.bigBox || frustum.intersectsBox(this.bigBox);
	}

	/** 是否为叶子瓦片 */
	public get isLeaf(): boolean {
		return !this.subTiles;
	}

	/** 取得瓦片是否显示 */
	public get showing(): boolean {
		return !!this.model?.visible;
	}

	/** 设置瓦片是否显示 */
	public set showing(value) {
		if (value != this.showing && this.model) {
			this.model.traverse(child => child.layers.set(value ? 0 : 31));
			this.model.visible = value;
			this._root?.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: value });
		}
	}

	// 是否更新材质
	private _updateMaterial = false;
	// 是否更新几何体
	private _updateGeometry = false;

	private get _isDirty() {
		return this.model && (this._updateMaterial || this._updateGeometry);
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
		this.up.set(0, 0, 1);
		this.matrixAutoUpdate = false;
	}

	/**
	 * 瓦片射线检测，射线穿过瓦片包围盒内时，才进行模型的射线检测
	 */
	public raycast(raycaster: Raycaster) {
		return !this.bigBox || raycaster.ray.intersectsBox(this.bigBox);
	}

	/**
	 * 瓦片更新，该函数在每帧渲染中被调用
	 * @param params 瓦片加载参数
	 */
	public update(params: TileUpdateParames) {
		this._root = this.parent instanceof Tile ? this.parent._root : this;
		console.assert(!!this._root);

		// （没有父瓦片||模型正在加载）时不进行更新
		if (!this.parent || this._isLoading) {
			return;
		}

		// （当前层级>地图最小层级 && 下载线程数<最大下载线程数）时下载瓦片
		if (this.z >= params.minLevel && Tile._downloadingThreads < THREADSNUM) {
			if (!this.model) {
				this._startLoad(params.loader); // 下载瓦片
				return;
			}
			if (this._isDirty) {
				this._startUpdate(params.loader); // 更新瓦片
				return;
			}
		}

		// 如果是根瓦片，则计算一次视锥体和摄像机坐标
		if (this.z === 0) {
			const camera = params.camera;
			camera.getWorldPosition(cameraWorldPosition);
			frustum.setFromProjectionMatrix(tempMat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
		}

		// 阴影
		if (this.model) {
			this.model.castShadow = this._root?.castShadow || false;
			this.model.receiveShadow = this._root?.receiveShadow || false;
		}

		// LOD
		const newTiles = this.LOD(params);
		if (newTiles) {
			this.add(...newTiles);
			this._subTiles = newTiles;
			newTiles.forEach(child => {
				child.updateMatrix();
				child.updateMatrixWorld();
				this._root?.dispatchEvent({ type: "tile-created", tile: child });
			});
		}

		// 递归更新子瓦片
		this.subTiles?.forEach(child => child.update(params));
	}

	/**
	 * LOD (Level of Detail).
	 * @param threshold - LOD 阈值
	 * @returns newTiles - 新创建的子瓦片数组
	 */
	protected LOD(params: TileUpdateParames) {
		const { loader, minLevel, maxLevel, LODThreshold } = params;
		const action = LODEvaluate(this, minLevel, maxLevel, LODThreshold);
		if (action === LODAction.create) {
			// console.log("create", this.name);
			return createChildren(this, loader);
		}
		if (action === LODAction.remove) {
			// console.log("remove", this.name);
			this.showing = true;
			this.unLoad(loader, false);
		}
		return undefined;
	}

	/**
	 * 检查4个兄弟瓦片全部下载完成时再显示
	 */
	private _checkVisible() {
		const parent = this.parent;
		if (parent instanceof Tile && parent.subTiles) {
			const subTiles = parent.subTiles;
			const allLoaded = subTiles.every(child => child.model);
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
		Tile._downloadingThreads++;
		const model = await loader.load(this);
		this._model = model;
		model.geometry.computeBoundingBox();
		// 更新bbox
		this.bbox.max.z = model.geometry.boundingBox?.max.z || 0;
		Tile._downloadingThreads--;
		this._isLoading = false;
		this._root?.dispatchEvent({ type: "tile-loaded", tile: this });
		this.isLeaf && this._checkVisible();
		this.add(model);

		return model;
	}

	/**
	 * 更新瓦片数据
	 * @param loader  - 瓦片加载器
	 * @returns this
	 */
	private async _startUpdate(loader: ITileLoader) {
		if (!this.model) {
			return;
		}
		this._isLoading = true;
		Tile._downloadingThreads++;
		await loader.update(this.model, this, this._updateMaterial, this._updateGeometry);
		// 更新bbox
		this.bbox.max.z = this.model.geometry.boundingBox?.max.z || 0;
		this._updateMaterial = false;
		this._updateGeometry = false;
		Tile._downloadingThreads--;
		this._isLoading = false;
		this._root?.dispatchEvent({ type: "tile-loaded", tile: this });
	}

	/**
	 * 重新加载(更新)瓦片数据
	 * @param updateMaterial - 是否更新材质
	 * @param updateGeometry - 是否更新几何体
	 * @returns this
	 */
	public updateSource(updateMaterial: boolean, updateGeometry: boolean) {
		this.traverse(child => {
			if (child instanceof Tile && child.model) {
				child._updateMaterial = updateMaterial;
				child._updateGeometry = updateGeometry;
			}
		});
		return this;
	}

	/**
	 * 销毁瓦片树并重新创建并加载数据
	 * @param loader - 瓦片加载器
	 * @returns this
	 */
	public reload(loader: ITileLoader) {
		return this.unLoad(loader, true);
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
			this._subTiles = undefined;
		}
		// 卸载自己
		if (unLoadSelf && this.model) {
			loader.unload(this.model);
			this._root?.dispatchEvent({ type: "tile-unload", tile: this });
			this._model = undefined;
		}
		return this;
	}
}
