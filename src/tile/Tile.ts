/**
 *@description: map tile
 *@author: Guojf
 *@date: 2023-04-05
 */

import {
	BufferGeometry,
	Camera,
	Intersection,
	Material,
	Mesh,
	MeshBasicMaterial,
	PlaneGeometry,
	Raycaster,
} from "three";
import { ITileLoader } from "../loader/ITileLoaders";
import { creatChildrenTile } from "./tileCreator";
import { LODAction, evaluate } from "./LODEvaluate";
import { checkVisible } from "./checkVisible";

// default geometry of tile
const defaultGeometry = new PlaneGeometry();

// default material of tile
const defaultMaterial = new MeshBasicMaterial({ color: 0xff0000 });

/**
 * state of tile data
 */
export type LoadState = "empty" | "loading" | "loaded";

/**
 * coordinate of tile
 */
export type TileCoord = { x: number; y: number; z: number };

/**
 * class Tile, inherit of Mesh
 */
export class Tile extends Mesh<BufferGeometry, Material[]> {
	/** coordinate of tile */
	public readonly coord: TileCoord;

	/** is a tile? */
	public readonly isTile = true;

	/** tile parent */
	public readonly parent: this | null = null;

	/** children of tile */
	public readonly children: this[] = [];

	/** max height of tile */
	public maxZ = 0;

	/** min height of tile */
	public minZ = 0;

	/** avg height of tile */
	public avgZ = 0;

	/** index of tile, mean positon in parent.
	 *  (0:left-bottom, 1:right-bottom,2:left-top、3:right-top、-1:parent is null）
	 */
	public get index(): number {
		return this.parent ? this.parent.children.indexOf(this) : -1;
	}

	/* downloading abort controller */
	private _abortController = new AbortController();

	/** singnal of abort when downloading  */
	public get abortSignal() {
		return this._abortController.signal;
	}

	private _loadState: LoadState = "empty";
	/** get the tile load state*/
	public get loadState() {
		return this._loadState;
	}

	private _toLoad = false;
	/** needs to load? */
	private get _needsLoad() {
		return this.inFrustum && this._toLoad && this.loadState === "empty";
	}

	private _inFrustum = false;
	/** tile in frustum? */
	public get inFrustum() {
		return this._inFrustum;
	}

	/** set the tile in frustum */
	protected set inFrustum(value) {
		if (this._inFrustum != value) {
			this._inFrustum = value;
			if (value) {
				// load data when leaf into frustum
				this._toLoad = this.isLeaf;
			} else {
				// dispose tile when leave frustum
				this.dispose(true);
			}
		}
	}

	/** is the tile  leaf in frustum ? */
	public get isLeafInFrustum() {
		return this.inFrustum && this.isLeaf;
	}

	private _isTemp = false;
	/** set the tile to temp*/
	public set isTemp(temp: boolean) {
		this._isTemp = temp;
		this.material.forEach((mat) => {
			if ("wireframe" in mat) {
				mat.wireframe = temp || mat.userData.wireframe;
			}
		});
		if (!temp) {
			const parent = this._getLoadedParent();
			if (parent && parent.loadState === "loaded") {
				// debugger;
			}
		}
	}

	/** is tile leaf?  */
	public get isLeaf() {
		return this.children.length === 0;
	}

	/**
	 * constructor
	 * @param x tile X-coordinate, default:0
	 * @param y tile X-coordinate, default:0
	 * * @param z tile level, default:0
	 */
	public constructor(x = 0, y = 0, z = 0) {
		super(defaultGeometry, [defaultMaterial]);
		this.coord = { x, y, z };
		this.name = `Tile ${z}-${x}-${y}`;
		this.matrixAutoUpdate = false;
		this.matrixWorldAutoUpdate = false;
	}

	/**
	 * Override Obejct3D.traverse, change the callback param type to "this"
	 * @param callback callback
	 */
	public traverse(callback: (object: this) => void): void {
		callback(this);
		this.children.forEach((tile) => {
			tile.traverse(callback);
		});
	}
	/**
	 * Override mesh.raycast，only when tile has loaded
	 * @param raycaster
	 * @param intersects
	 */
	public raycast(raycaster: Raycaster, intersects: Intersection[]): void {
		if (this.loadState === "loaded") {
			super.raycast(raycaster, intersects);
		}
	}

	/**
	 * Level Of Details
	 * @param camera
	 * @param minLevel min level for LOD
	 * @param maxLevel max level for LOD
	 * @param threshold threshold for LOD
	 * @param isWGS is WGS projection?
	 * @returns new tiles
	 */
	protected _lod(camera: Camera, minLevel: number, maxLevel: number, threshold: number, isWGS: boolean) {
		let newTiles: Tile[] = [];
		// evaluate LOD
		const action = evaluate(this, camera, minLevel, maxLevel, threshold);
		if (action === LODAction.create) {
			newTiles = creatChildrenTile(this, isWGS);
			this._toLoad = false;
		} else if (action === LODAction.remove) {
			const parent = this.parent;
			if (parent?.isTile) {
				parent._toLoad = true;
				// parent.children.forEach((child) => (child._toLoad = false));
			}
		}

		return newTiles;
	}

	/**
	 * load tile data
	 * @param loader data loader
	 * @returns Promise<void>
	 */
	protected _load(loader: ITileLoader): Promise<void> {
		if (!this._needsLoad) {
			return Promise.resolve();
		}
		// Reset the abortC controller
		this._abortController = new AbortController();
		this._loadState = "loading";
		// Load tile data
		return new Promise((resolve, _reject) => {
			loader.load(
				this,
				() => resolve(this._onLoad()),
				(err) => resolve(this._onError(err)),
			);
		});
	}

	/**
	 * callback function when error. (include abort)
	 * @param err error message
	 * @returns
	 */
	private _onError(err: any) {
		this._toLoad = false;
		if (err.name === "AbortError") {
			// download abort, loadeState has seted empty
			console.assert(this._loadState === "empty");
			// console.log(err.message, this.name);
		} else {
			// download fail, set loadState to loaded to prevent reload
			this._loadState = "loaded";
			console.error(err.message || err.type || err);
		}
	}

	/**
	 * Recursion to find loaded parent (hide when parent showing)
	 * @returns loaded parent or null
	 */
	private _getLoadedParent(): this | null {
		const parent = this.parent;
		if (!parent || !parent.isTile) {
			return null;
		}
		if (parent.loadState === "loaded" && !parent._isTemp) {
			return parent;
		}
		return parent._getLoadedParent();
	}

	/**
	 * Tile loaded callback
	 */
	private _onLoad() {
		this._loadState = "loaded";

		// save the material.wireframe, rest when showing
		this.material.forEach((mat) => {
			if ("wireframe" in mat) {
				mat.userData.wireframe = mat.wireframe;
			}
		});
		this._updateHeight();

		if (!this.isLeaf && this._toLoad) {
			this.children.forEach((child) => child.dispose(true));
			this.clear();
		}

		this.isTemp = this._getLoadedParent() != null;

		this._toLoad = false;

		const loadedParent = this._getLoadedParent();
		if (loadedParent && loadedParent._getLoadedParent()) {
			console.log("----------------------------------------------");
			debugger;
		}
		if (loadedParent) {
			checkVisible(loadedParent);
		}
	}

	// update height
	private _updateHeight() {
		this.geometry.computeBoundingBox();
		this.maxZ = this.geometry.boundingBox?.max.z || 0;
		this.minZ = this.geometry.boundingBox?.min.z || 0;
		this.avgZ = (this.maxZ + this.minZ) / 2;
	}

	/**
	 * abort download
	 */
	public abortLoad() {
		this._abortController.abort();
	}

	/**
	 * free the tile
	 * @param removeChildren 是否移除子瓦片
	 */
	public dispose(removeChildren: boolean) {
		if (this.loadState != "empty") {
			this._dispose();
		}

		// if remove children, recursion
		if (removeChildren) {
			this.children.forEach((tile) => {
				tile.dispose(removeChildren);
				tile.clear();
			});
			this.clear();
		}

		return this;
	}

	private _dispose() {
		// abort...
		this.abortLoad();
		this._loadState = "empty";
		this.isTemp = true;
		this._toLoad = false;
		// dispose material
		if (this.material[0] != defaultMaterial) {
			this.material.forEach((mat) => mat.dispose());
			this.material = [defaultMaterial];
		}

		// dispose geometry
		if (this.geometry != defaultGeometry) {
			this.geometry.dispose();
			this.geometry.groups = [];
			this.geometry = defaultGeometry;
		}

		// fire dispose
		this.dispatchEvent({ type: "dispose" });
	}
}
