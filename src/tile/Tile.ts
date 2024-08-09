/**
 *@description: map tile
 *@author: Guojf
 *@date: 2023-04-05
 */

import {
	BaseEvent,
	BufferGeometry,
	Material,
	Mesh,
	MeshBasicMaterial,
	Object3DEventMap,
	PlaneGeometry,
	Vector3,
} from "three";
import { ITileLoader } from "../loader/ITileLoaders";
import { LODAction, evaluate } from "./LODEvaluate";
import { creatChildrenTile } from "./tileCreator";

/**
 * Tile event map
 */
export interface TTileEventMap extends Object3DEventMap {
	dispose: BaseEvent;
	"tile-created": BaseEvent & { tile: Tile };
	"tile-load-error": BaseEvent & { tile: Tile; message: string };
	"tile-loaded": BaseEvent & { tile: Tile };
}

// Default geometry of tile
const defaultGeometry = new PlaneGeometry();

// Default material of tile
const defaultMaterial = new MeshBasicMaterial();

/**
 * Type of Loading state
 */
export type LoadState = "empty" | "loading" | "loaded";

/**
 * Type of coordinate of tile
 */
export type TileCoord = { x: number; y: number; z: number };

/**
 * Class Tile, inherit of Mesh
 */
export class Tile extends Mesh<BufferGeometry, Material[], TTileEventMap> {
	// export class Tile<TTileEvent extends TTileEventMap = TTileEventMap> extends Mesh<BufferGeometry, Material[], TTileEvent> {
	/** Coordinate of tile */
	public readonly coord: TileCoord;

	/** Is a tile? */
	public readonly isTile = true;

	/** Tile parent */
	public readonly parent: this | null = null;

	/** Children of tile */
	public readonly children: this[] = [];

	/** Max height of tile */
	public maxZ = 0;

	/** Min height of tile */
	public minZ = 0;

	/** Avg height of tile */
	public avgZ = 0;

	/** Distance of tile to campera */
	public distFromCamera = 0;

	/** Index of tile, mean positon in parent.
	 *  (0:left-bottom, 1:right-bottom,2:left-top、3:right-top、-1:parent is null）
	 */
	public get index(): number {
		return this.parent ? this.parent.children.indexOf(this) : -1;
	}

	/* Downloading abort controller */
	private _abortController = new AbortController();

	/** Singnal of abort when downloading  */
	public get abortSignal() {
		return this._abortController.signal;
	}

	private _loadState: LoadState = "empty";

	/** Get the tile load state*/
	public get loadState() {
		return this._loadState;
	}

	private _toLoad = false;

	/** Tile needs to load? */
	private get _needsLoad() {
		return this.inFrustum && this._toLoad && this.loadState === "empty";
	}

	private _inFrustum = false;

	/** Tile is tile in frustum? */
	public get inFrustum() {
		return this._inFrustum;
	}

	/** Set tile is in frustum or not */
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

	/** Tile is a leaf in frustum? */
	public get isLeafInFrustum() {
		return this.inFrustum && this.isLeaf;
	}

	private _isTemp = false;

	/** Set the tile to temp */
	private set isTemp(temp: boolean) {
		this._isTemp = temp;
		this.material.forEach((mat) => {
			if ("wireframe" in mat) {
				mat.wireframe = temp || mat.userData.wireframe;
			}
		});
	}

	/** Tile is a leaf?  */
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
	 * Override Obejct3D.traverseVisible, change the callback param type to "this"
	 * @param callback callback
	 */
	public traverseVisible(callback: (object: this) => void): void {
		if (this.visible) {
			callback(this);
			this.children.forEach((tile) => {
				tile.traverseVisible(callback);
			});
		}
	}

	private _getDist(cameraPosition: Vector3) {
		const tilePos = this.position.clone().setZ(this.avgZ).applyMatrix4(this.matrixWorld);
		return cameraPosition.distanceTo(tilePos);
	}

	/**
	 * Level Of Details
	 * @param cameraWorldPosition
	 * @param minLevel min level for LOD
	 * @param maxLevel max level for LOD
	 * @param threshold threshold for LOD
	 * @param isWGS is WGS projection?
	 * @returns  new tiles
	 */
	protected _LOD(
		cameraWorldPosition: Vector3,
		minLevel: number,
		maxLevel: number,
		threshold: number,
		isWGS: boolean,
	) {
		let newTiles: Tile[] = [];
		this.distFromCamera = this._getDist(cameraWorldPosition);
		// LOD evaluate
		const action = evaluate(this, minLevel, maxLevel, threshold);
		if (action === LODAction.create) {
			newTiles = creatChildrenTile(this, isWGS);
			this._toLoad = false;
		} else if (action === LODAction.remove) {
			const parent = this.parent;
			if (parent?.isTile) {
				parent._toLoad = true;
			}
		}

		return newTiles;
	}

	/**
	 * Load data
	 * @param loader data loader
	 * @returns Promise<void>
	 */
	public load(loader: ITileLoader): Promise<void> {
		if (!this._needsLoad) {
			return Promise.resolve();
		}
		// Reset the abortC controller
		this._abortController = new AbortController();
		this._loadState = "loading";
		// Load tile data
		return new Promise((resolve, reject) => {
			loader.load(
				this,
				() => resolve(this._onLoad()),
				(err) => {
					this._toLoad = false;
					if (err.name === "AbortError") {
						// download abort, loadeState has seted empty
						console.assert(this._loadState === "empty");
					} else {
						// download fail, set loadState to loaded to prevent reload
						this._loadState = "loaded";
						reject(err);
					}
				},
			);
		});
	}

	/**
	 * Recursion to find loaded parent (hide on parent showing)
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

	public _checkVisible(): boolean {
		const leafs: Tile[] = [];
		this.traverse((child) => leafs.push(child));
		const loaded = leafs.filter((child) => child.isLeafInFrustum).every((child) => child.loadState === "loaded");
		if (loaded) {
			leafs.forEach((child) => {
				if (child.isLeaf) {
					child.isTemp = false;
				} else {
					child.dispose(false);
				}
			});
		}
		return loaded;
	}

	/**
	 * tile loaded callback
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

		const loadedParent = this._getLoadedParent();
		this.isTemp = !!loadedParent;
		this._toLoad = false;
		loadedParent?._checkVisible();
	}

	// update height
	private _updateHeight() {
		// this.geometry.computeBoundingBox();
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
	 * @param removeChildren remove children?
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
