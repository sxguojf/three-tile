/**
 *@description: LOD Tile
 *@author: 郭江峰
 *@date: 2025-05-01
 */

import {
	BaseEvent,
	Box3,
	Box3Helper,
	Camera,
	Matrix4,
	Mesh,
	Object3D,
	Object3DEventMap,
	Raycaster,
	Vector3,
} from "three";
import { ITileLoader } from "./ITileLoader";
import { FrustumEx } from "./FrustumEx";
import { createChildren, LODAction, LODEvaluate } from "./util";

/** 最大下载线程数 */
const MAXTHREADS = 10;
/** 相机世界坐标 */
const cameraWorldPosition = new Vector3();
/** 场景视锥体 */
const frustum = new FrustumEx();
/** 临时变量 */
const tempMat4 = new Matrix4();
const tempVec3 = new Vector3();

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
 * 瓦片事件映射类型，为了便于使用，所有事件均由根瓦片发出
 */
interface TTileEventMap extends Object3DEventMap {
	/** 瓦片创建事件 */
	"tile-created": BaseEvent & { tile: Tile };
	/** 瓦片加载完成事件 */
	"tile-loaded": BaseEvent & { tile: Tile };
	/** 瓦片卸载事件 */
	"tile-unload": BaseEvent & { tile: Tile };
	/** 瓦片可视状态改变事件 */
	"tile-visible-changed": BaseEvent & { tile: Tile; visible: boolean };
}

/**
 * 动态LOD（DLOD）地图瓦片类，用于表示地图中的一块瓦片，瓦片可以包含子瓦片，以四叉树方式管理。
 */
export class Tile extends Object3D<TTileEventMap> {
	/** 瓦片x坐标 */
	public readonly x: number;
	/** 瓦片y坐标 */
	public readonly y: number;
	/** 瓦片层级 */
	public readonly z: number;

	/** 是否为瓦片 */
	public readonly isTile = true;

	/** 瓦片是否正在加载中 */
	private _isLoading = false;

	/** 根瓦片 */
	private _root: Tile = this;

	/** 瓦片距离检测点世界坐标 */
	private _checkPoint: Vector3 = new Vector3();

	/* 瓦片在世界坐标系中的大小*/
	private _sizeInWorld = -1;

	/** 瓦片包围盒（世界坐标） */
	private _bbox: Box3 | null = null;

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

	/** 瓦片到相机的距离比例，用于 LOD 评估，值越小瓦片越密集 */
	public get distRatio() {
		const distToCamera = cameraWorldPosition.distanceTo(this._checkPoint);
		const ratio = distToCamera / this._sizeInWorld;
		return this.inFrustum ? ratio * 0.8 : ratio * 2;
	}

	/** 瓦片是否在视锥体内 */
	public get inFrustum(): boolean {
		return !!this._bbox && frustum.intersectsBox(this._bbox);
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
		if (this.model) {
			if (value) {
				this.model.castShadow = this._root.castShadow;
				this.model.receiveShadow = this._root.receiveShadow;
			}
			if (value != this.showing) {
				this.model.traverse(child => child.layers.set(value ? 0 : 31));
				this.model.visible = value;
				this._root.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: value });
			}
		} else {
			console.assert(!value);
		}
	}

	// 是否更新材质
	private _updateMaterial = false;
	// 是否更新几何体
	private _updateGeometry = false;

	private get _isDirty(): boolean {
		return !!this.model && (this._updateMaterial || this._updateGeometry);
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
	 * 瓦片射线检测，仅检测视锥体中的瓦片
	 */
	public raycast(_raycaster: Raycaster) {
		return this.inFrustum;
	}

	/**
	 * 计算瓦片checkpoint、bbox、size
	 */
	private computeTileSize(debug: number) {
		// 瓦片包围盒-世界坐标
		this._bbox = new Box3(new Vector3(-0.5, -0.5), new Vector3(0.5, 0.5)).applyMatrix4(this.matrixWorld);
		// 距离检测点-瓦片中心世界坐标
		this._checkPoint = new Vector3().applyMatrix4(this.matrixWorld);
		// 瓦片大小-对角线长度
		this._sizeInWorld = this._bbox.getSize(tempVec3).length();
		console.assert(this._sizeInWorld > 10);
		// 增大包围盒高度（-300到90000米）
		this._bbox.min.setY(-300);
		this._bbox.max.setY(9000);

		// 添加瓦片调试瓦围盒
		if (debug > 1) {
			// 包围盒局地坐标
			const box = this._bbox.clone().applyMatrix4(this.matrixWorld.clone().invert());
			const boxMesh = new Box3Helper(box, 0xff000);
			boxMesh.name = "tilebox";
			this.add(boxMesh);
		}

		return this._sizeInWorld;
	}

	/**
	 * 瓦片更新，该函数在每帧渲染中被调用
	 * @param params 瓦片加载参数
	 */
	public update(params: TileUpdateParames) {
		// （没有父瓦片||模型正在加载）时不进行更新
		if (!this.parent || this._isLoading) {
			return;
		}

		// 设置根瓦片
		if (this.parent instanceof Tile) {
			this._root = this.parent._root;
		}
		console.assert(this._root.z === 0);

		const { loader, minLevel, camera } = params;

		// 如果是根瓦片，则计算一次视锥体和摄像机坐标
		if (this.z === 0) {
			camera.getWorldPosition(cameraWorldPosition);
			frustum.setFromProjectionMatrix(tempMat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
		}

		// 计算瓦片大小、包围盒等
		if (this._sizeInWorld < 0) {
			this.computeTileSize(loader.debug);
		}

		// （当前层级>地图最小层级 && 下载线程数<最大下载线程数）时下载或更新瓦片
		if (this.z >= minLevel && loader.downloadingThreads < MAXTHREADS) {
			// 下载瓦片
			if (!this.model) {
				this._startLoad(loader);
				return;
			}

			// 更新脏瓦片
			if (this._isDirty && this.inFrustum) {
				// 先更新子瓦片再更新父瓦片，以加快显示
				const childrenUpdated = !this.subTiles?.some(child => child._isDirty);
				if (childrenUpdated) {
					this._startUpdate(loader);
					return;
				}
			}
		}

		// 子瓦片阴影取决于根瓦片
		if (this.model) {
			this.model.castShadow = this._root.castShadow;
			this.model.receiveShadow = this._root.receiveShadow;
		}

		// LOD
		this.LOD(params);

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
			const newTiles = createChildren(this, loader);
			this.add(...newTiles);
			this._subTiles = newTiles;
			this._subTiles.forEach(child => {
				child.updateMatrixWorld();
				this._root.dispatchEvent({ type: "tile-created", tile: child });
			});
		} else if (action === LODAction.remove) {
			// console.log("remove", this.name);
			if (this.model) {
				this.showing = true;
				this.unLoad(loader, false);
			}
		}
		return action;
	}

	/**
	 * 检查4个兄弟瓦片全部下载完成时再显示
	 */
	private _checkVisible() {
		const parent = this.parent;
		if (parent instanceof Tile) {
			if (parent.model) {
				const subTiles = parent.subTiles;
				if (subTiles) {
					const allLoaded = !subTiles.some(child => !child.model);
					subTiles.forEach(child => (child.showing = allLoaded));
					parent.showing = !allLoaded;
				}
			} else {
				this.showing = true;
			}
		}
		return this;
	}

	/**
	 * 下载瓦片数据
	 * @param loader  - 瓦片加载器
	 */
	private async _startLoad(loader: ITileLoader) {
		this._isLoading = true;
		this._model = await loader.load(this);
		this._model.geometry.computeBoundingBox();
		this._checkPoint.y = this._model.geometry.boundingBox?.max.z || 0;
		this.isLeaf && this._checkVisible();
		this._isLoading = false;
		this._root.dispatchEvent({ type: "tile-loaded", tile: this });
		this.add(this._model);
	}

	/**
	 * 更新瓦片数据
	 * @param loader - 瓦片加载器
	 * @returns this
	 */
	private async _startUpdate(loader: ITileLoader) {
		if (!this.model) {
			return;
		}
		this._isLoading = true;
		this._model = await loader.update(this.model, this, this._updateMaterial, this._updateGeometry);
		this.model.geometry.computeBoundingBox();
		this._checkPoint.y = this.model.geometry.boundingBox?.max.z || 0;
		this._updateMaterial = false;
		this._updateGeometry = false;
		this._isLoading = false;
		this._root.dispatchEvent({ type: "tile-loaded", tile: this });
	}

	/**
	 * 更新瓦片数据
	 * @param updateMaterial - 是否更新材质
	 * @param updateGeometry - 是否更新几何体
	 * @returns this
	 */
	public updateData(updateMaterial: boolean, updateGeometry: boolean) {
		this.traverse(child => {
			if (child instanceof Tile && (child.model || child._isLoading)) {
				child._updateMaterial = updateMaterial;
				child._updateGeometry = updateGeometry;
			}
		});
		return this;
	}

	/**
	 * 销毁瓦片树重新创建，并加载数据，改变地图投影时必须调用它以生效
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
			this._root.dispatchEvent({ type: "tile-unload", tile: this });
			this._model = undefined;
		}
		// 卸载调试包围盒
		if (loader.debug > 1) {
			(this.getObjectByName("tilebox") as Mesh)?.geometry.dispose();
		}
		return this;
	}
}
