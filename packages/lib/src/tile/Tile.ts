/**
 *@description: LOD Tile
 *@author: 郭江峰
 *@date: 2025-05-01
 */

import { BaseEvent, Box3, Camera, Matrix4, Mesh, Object3D, Object3DEventMap, Raycaster, Vector3 } from "three";
import { FrustumEx } from "./FrustumEx";
import { ITileLoader, TileMesh } from "./ITileLoader";
import { createChildren, LODAction, LODEvaluate } from "./util";

/** 相机世界坐标 */
const cameraWorldPosition = new Vector3();
/** 场景视锥体 */
const frustum = new FrustumEx();
/** 临时变量 */
const tempMat4 = new Matrix4();
const tempVec3 = new Vector3();

/** 瓦片更新参数类型 */
type TileUpdateParames = {
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

	/* 瓦片在世界坐标系中的大小*/
	private _sizeInWorld = -1;

	/** 瓦片包围盒（世界坐标） */
	// private _bbox: Box3 | null = null;

	private _model?: TileMesh;
	/** 瓦片模型 */
	public get model() {
		return this._model;
	}

	private _subTiles: Tile[] | undefined;
	/** 子瓦片 */
	public get subTiles() {
		return this._subTiles;
	}

	/** 瓦片到相机的距离比例，用于 LOD 评估，值越小瓦片越密集 */
	public get distRatio() {
		const checkPoint = new Vector3().applyMatrix4(this.matrixWorld);
		checkPoint.setY(this.model?.geometry.boundingBox?.max.z || 0);
		const distToCamera = cameraWorldPosition.distanceTo(checkPoint);
		const ratio = distToCamera / this._sizeInWorld;
		return this.inFrustum ? ratio * 0.8 : ratio * 2;
	}

	/** 瓦片是否在视锥体内 */
	public get inFrustum(): boolean {
		// 瓦片包围盒世界坐标
		const bbox = this.getBBox();
		return frustum.intersectsBox(bbox);
	}

	/** 是否为叶子瓦片 */
	public get isLeaf(): boolean {
		return !this.subTiles;
	}

	/** 取得瓦片是否显示 */
	public get showing(): boolean {
		return !!this.model && this.model.visible;
	}

	/** 设置瓦片是否显示 */
	public set showing(value) {
		if (this.model) {
			if (value) {
				this._updateShadow();
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

	/** 是否为脏瓦片 */
	private _isDirty = false;

	private _needsLoad(loader: ITileLoader) {
		// 下载线程数>最大下载线程数不下载
		if (loader.downloadingThreads >= loader.maxThreads) {
			return false;
		}

		// 没有模型则下载
		if (!this.model) {
			return true;
		}

		// 不是脏瓦片或者不在视野范围内不下载
		if (!this._isDirty || !this.inFrustum) {
			return false;
		}

		// 父瓦片等子瓦片已下载完成后再下载
		return !this.subTiles?.some(tile => !tile._isDirty);

		// 仅下载叶子瓦片
		// return  this.isLeaf;

		// 仅加载叶子瓦片和其父瓦片
		// return !this.subTiles || this.subTiles?.some(tile => tile.isLeaf);
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
	}

	/**
	 * 瓦片射线检测，仅检测视锥体中的瓦片
	 */
	public raycast(_raycaster: Raycaster) {
		return this.inFrustum;
	}

	/** 计算瓦片包围盒（世界坐标） */
	public getBBox() {
		const bbox = new Box3(
			new Vector3(-this.scale.x, -this.scale.y, 0),
			new Vector3(this.scale.x, this.scale.y, 0)
		).applyMatrix4(this.matrixWorld);

		if (this.model) {
			bbox.max.setY(this.model.geometry.boundingBox?.max.z || 0);
		} else {
			bbox.min.setY(-300);
			bbox.max.setY(9000);
		}
		return bbox;
	}

	/**
	 * 计算瓦片大小
	 * @returns 瓦片对角线长度
	 */
	public getTileSize() {
		if (this._sizeInWorld < 0) {
			const bbox = new Box3(new Vector3(-0.5, -0.5, 0), new Vector3(0.5, 0.5, 0)).applyMatrix4(this.matrixWorld);
			this._sizeInWorld = bbox.getSize(tempVec3).length();
			console.assert(this._sizeInWorld > 10);
		}

		return this._sizeInWorld;
	}

	/**
	 * 瓦片更新，该函数在每帧渲染中被调用
	 * @param params 瓦片更新参数，包括相机、加载器、最小层级、最大层级和LOD阈值
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

		// 下载瓦片
		if (this.z >= minLevel && this._needsLoad(loader)) {
			if (this.model) {
				this._startModify(loader);
			} else {
				this._startLoad(loader);
			}
			return;
		}

		// 更新瓦片阴影
		this._updateShadow();

		// LOD
		this.LOD(params);

		// 递归更新子瓦片
		this.subTiles?.forEach(child => child.update(params));
	}

	/** 更新瓦片阴影 */
	private _updateShadow() {
		if (this.model) {
			this.model.castShadow = this._root.castShadow;
			this.model.receiveShadow = this._root.receiveShadow;
		}
	}

	/**
	 * LOD (Level of Detail).
	 * @returns add or remove
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
				child.updateMatrix();
				child.getTileSize();
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
	 * 瓦片下载完成后，检查4个兄弟瓦片全部下载完成时再显示
	 */
	private _checkVisible() {
		const parent = this.parent;
		if (parent instanceof Tile) {
			if (parent.model) {
				const subTiles = parent.subTiles;
				if (subTiles) {
					const allLoaded = !subTiles.some(tile => !tile.model);
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
		console.assert(!this.model);

		this._isLoading = true;
		// load
		const model = await loader.load(this);
		this._model = model;
		model.geometry.computeBoundingBox();
		this.add(model);
		this._root.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: true });
		this.isLeaf && this._checkVisible();
		this._isLoading = false;
		this._root.dispatchEvent({ type: "tile-loaded", tile: this });
	}

	/**
	 * 修改瓦片数据
	 * @param loader  - 瓦片加载器
	 */
	private async _startModify(loader: ITileLoader) {
		console.assert(!!this.model);

		if (this.model) {
			this._isLoading = true;
			// load
			await loader.update(this, this.model);
			this.model.geometry.computeBoundingBox();
			this._root.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: true });
			this._isDirty = false;
			this._isLoading = false;
			this._root.dispatchEvent({ type: "tile-loaded", tile: this });
		}
	}

	/**
	 * 重新加载瓦片数据
	 * @param loader - 瓦片加载器
	 * @param dispose - 是否销毁瓦片树
	 * @returns this
	 */
	public reload(loader: ITileLoader, dispose = true) {
		if (dispose) {
			return this.unLoad(loader, true);
		} else {
			this.traverse(child => {
				if (child instanceof Tile && (child.model || child._isLoading)) {
					child._isDirty = true;
				}
			});
		}
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
			this._subTiles = undefined;
		}
		// 卸载自己
		if (unLoadSelf && this.model) {
			this.model.removeFromParent();
			loader.unload(this.model);
			this._model = undefined;
			this._isDirty = false;
			this._root.dispatchEvent({ type: "tile-unload", tile: this });
		}
		// 卸载调试包围盒
		if (loader.debug > 1) {
			(this.getObjectByName("tilebox") as Mesh)?.geometry.dispose();
		}
		return this;
	}
}
