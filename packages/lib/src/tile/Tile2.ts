import { Box3, BufferGeometry, Frustum, Material, Mesh, Object3D, Vector3 } from "three";
import { TileLoader } from "../loader/TileLoader";

type LoadState = "empty" | "loading" | "loaded" | "error";

export class Tile extends Object3D {
	/** 瓦片x坐标 */
	public readonly x: number;

	/** 瓦片y坐标 */
	public readonly y: number;

	/** 瓦片层级 */
	public readonly z: number;

	/** 是否为瓦片 */
	public readonly isTile = true;

	/* 瓦片在世界坐标系中的大小*/
	private _sizeInWorld = -1;

	/** 瓦片数据加载状态 */
	private _loadState: LoadState = "empty";
	public get loadState() {
		return this._loadState;
	}

	/** 是否为叶子瓦片 */
	public get isLeaf(): boolean {
		return !this.subTiles;
	}

	private _needsUpdate = true;
	/** 是否需要更新 */
	public get needsUpdate() {
		return this._needsUpdate && this.loadState === "empty";
	}

	private _inFrustum = false;
	/** 是否在视锥体内 */
	public get inFrustum() {
		return this._inFrustum;
	}

	/** 取得瓦片模型是否可视 */
	public get modelVisible(): boolean {
		return !!this.model?.visible;
	}

	/** 设置瓦片模型是否可视 */
	public set modelVisible(value: boolean) {
		this.model && (this.model.visible = value);
	}

	private _model: Mesh<BufferGeometry, Material[]> | undefined = undefined;
	/** 取得瓦片模型 */
	public get model() {
		return this._model;
	}

	private _subTiles: Tile[] | undefined;
	/** 取得子瓦片 */
	public get subTiles() {
		return this._subTiles;
	}

	/**
	 * 构造函数
	 * @param x 瓦片x坐标
	 * @param y 瓦片y坐标
	 * @param z 瓦片层级
	 */
	public constructor(x: number = 0, y: number = 0, z: number = 0) {
		super();
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = `Tile ${z}-${x}-${y}`;
		this.up.set(0, 0, 1);
	}

	/** 取得瓦片包围盒（世界坐标） */
	public getBBox() {
		let maxY = 9000;
		if (this.loadState === "loaded") {
			maxY = this.model?.geometry.boundingBox?.max.z || 0;
		}
		const bbox = new Box3(
			new Vector3(-this.scale.x, -this.scale.y, -300),
			new Vector3(this.scale.x, this.scale.y, maxY)
		).applyMatrix4(this.matrixWorld);

		return bbox;
	}

	/**
	 * 取得瓦片视宽角（瓦片到摄像机距离/对角线长度）
	 * @param cameraPositon 摄像机世界坐标
	 * @returns 瓦片到摄像机距离/对角线长度
	 */
	private _getDistRatio(cameraPositon: Vector3) {
		if (this._sizeInWorld < 0) {
			const p1 = new Vector3(-this.scale.x, -this.scale.y).applyMatrix4(this.matrixWorld);
			const p2 = new Vector3(this.scale.x, this.scale.y).applyMatrix4(this.matrixWorld);
			this._sizeInWorld = p1.distanceTo(p2);
			console.assert(this._sizeInWorld > 10);
		}

		const center = this.localToWorld(this.position.clone());
		center.setY(this.model?.geometry.boundingBox?.max.z || 0);
		const dist = center.distanceTo(cameraPositon);
		const ratio = dist / this._sizeInWorld;

		return ratio;
	}

	/** LOD评估 */
	private _LODEvaluate = (cameraWorldPosition: Vector3, inFrustm: boolean) => {
		const distRatio = this._getDistRatio(cameraWorldPosition) * (inFrustm ? 0.8 : 5);
		if (this.isLeaf && inFrustm && distRatio < 1) {
			return "create";
		}
		if (!this.isLeaf && distRatio > 1) {
			return "remove";
		}
		return "none";
	};

	/** LOD */
	public LOD(cameraWorldPosition: Vector3, frustum: Frustum, { minLevel = 2, maxLevel = 13 } = {}) {
		if (this.loadState === "loading") {
			return "none";
		}

		this._inFrustum = frustum.intersectsBox(this.getBBox());
		const action = this._LODEvaluate(cameraWorldPosition, this._inFrustum);
		if (action === "create" && this.z < maxLevel) {
			if (this.modelVisible || this.z <= minLevel) {
				console.log("create children", this.name);
				this._createSubTiles();
			}
		} else if (action === "remove" && this.z >= minLevel) {
			this._needsUpdate = true;
			if (this.loadState === "loaded") {
				console.log("remove children", this.name);
				this.disposeSubTiles();
				this.modelVisible = true;
			}
		}
		return action;
	}

	/** 创建子瓦片 */
	private _createSubTiles() {
		console.assert(!this.subTiles, "子瓦片已存在，无法重复创建");

		function creatTile(x: number, y: number, z: number, px: number, py: number, sx: number, sy: number, sz: number) {
			const tile = new Tile(x, y, z);
			tile.position.set(px, py, 0);
			tile.scale.set(sx, sy, sz);
			return tile;
		}

		const x = this.x * 2;
		const y = this.y * 2;
		const z = this.z + 1;

		const pos = 0.25;
		const sx = 0.5;
		const sz = 1.0;
		const sy = 0.5;

		const t1 = creatTile(x, y, z, -pos, pos, sx, sy, sz);
		const t2 = creatTile(x + 1, y, z, pos, pos, sx, sy, sz);
		const t3 = creatTile(x, y + 1, z, -pos, -pos, sx, sy, sz);
		const t4 = creatTile(x + 1, y + 1, z, pos, -pos, sx, sy, sz);

		this._subTiles = [t1, t2, t3, t4];
		this._subTiles.forEach(child => {
			this.add(child);
			child.updateMatrix();
			child.updateMatrixWorld();
		});

		return this;
	}

	/** 加载瓦片模型 */
	public async loadModel(loader: TileLoader) {
		this._needsUpdate = false;
		if (this.loadState === "loading") {
			return false;
		}
		this._loadState = "loading";

		this._model ||= new Mesh<BufferGeometry, Material[]>(undefined, []);

		const updated = await loader.update(this, this._model);
		this._loadState = "loaded";

		if (updated) {
			this.add(this._model);
			this._model.geometry.computeBoundingBox();
			if (!this.parent) {
				this.dispose();
			} else {
				this.checkVisible();
			}
		}

		return updated;
	}

	/** 瓦片下载完成后，检查4个兄弟瓦片全部下载完成时再显示 */
	public checkVisible() {
		if (!this.isLeaf) {
			if (this._needsUpdate) {
				this.disposeSubTiles();
				this.modelVisible = true;
			} else {
				this.modelVisible = false;
			}
			return;
		}

		const parent = this.parent;
		if (parent instanceof Tile) {
			const subTiles = parent.subTiles;
			if (subTiles) {
				const allLoaded = !subTiles.some(tile => tile.loadState !== "loaded");
				subTiles.forEach(child => child.model && (child.modelVisible = allLoaded));
				parent.modelVisible = !allLoaded;
				if (allLoaded) {
					parent.disposeModel();
				}
			}
		}
	}

	/** 释放瓦片模型 */
	public disposeModel() {
		if (this.loadState !== "loaded") {
			return this;
		}
		const model = this.model;
		if (!model) {
			return this;
		}

		model.removeFromParent();

		model.material.forEach((material: any) => {
			for (const key in material) {
				const value = material[key];
				if (value && value.isTexture) {
					value.dispose();
				}
				material.dispose();
			}
		});
		model.material = [];
		model.geometry.dispose();

		this._loadState = "empty";
		this._model = undefined;

		return this;
	}

	/** 释放子瓦片 */
	public disposeSubTiles() {
		this.subTiles?.forEach(child => {
			child.removeFromParent();
			child.disposeModel();
			child.disposeSubTiles();
		});
		this._subTiles = undefined;

		return this;
	}

	/** 释放瓦片，包括模型和子瓦片 */
	public dispose() {
		this.disposeModel();
		this.disposeSubTiles();
	}
}
