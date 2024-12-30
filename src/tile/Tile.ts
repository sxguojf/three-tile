/**
 *@description: Tile of map
 *@author: Guojf
 *@date: 2023-04-05
 */

import { BaseEvent, BufferGeometry, Intersection, Material, Mesh, Object3DEventMap, Raycaster } from "three";
import { ITileLoader } from "../loader/ITileLoaders";

/**
 * Tile event map
 */
export interface TTileEventMap extends Object3DEventMap {
	dispose: BaseEvent;
	ready: BaseEvent;
	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };
}

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

	/** Distance of tile to camera */
	public distToCamera = 0;

	private _showing = false;
	private _inFrustum = false;
	private _loadState: LoadState = "empty";
	private _sizeInWorld = 0;

	private _abortController = new AbortController();

	/** Index of tile, mean positon in parent.  (0:left-bottom, 1:right-bottom,2:left-top、3:right-top、-1:parent is null）	 */
	public get index(): number {
		return this.parent ? this.parent.children.indexOf(this) : -1;
	}

	/** Singnal of abort when downloading  */
	public get abortSignal() {
		return this._abortController.signal;
	}

	/** Get load state */
	public get loadState() {
		return this._loadState;
	}

	/** Is tile in frustum ? */
	public get inFrustum() {
		return this._inFrustum;
	}

	/** Set tile is in frustum */
	protected set inFrustum(value) {
		this._inFrustum = value;
	}

	/** Get tile is showing ? */
	public get showing() {
		return this._showing;
	}

	/** Set tile showing or hiding */
	public set showing(value) {
		if (this.isTile) {
			this._showing = value;
			if (Array.isArray(this.material)) {
				this.material.forEach((mat) => (mat.visible = value));
			}
		}
	}

	/** Tile is a leaf ?  */
	public get isLeaf(): boolean {
		return this.children.filter((child) => child.isTile).length === 0;
	}

	/** Get the tile diagonal length of tile in world */
	public get sizeInWorld() {
		return this._sizeInWorld;
	}

	/** Set the tile diagonal length of tile in world */
	public set sizeInWorld(value) {
		this._sizeInWorld = value;
	}

	/**
	 * constructor
	 * @param x tile X-coordinate, default:0
	 * @param y tile X-coordinate, default:0
	 * * @param z tile level, default:0
	 */
	public constructor(x = 0, y = 0, z = 0) {
		super();
		this.coord = { x, y, z };
		this.name = `Tile ${z}-${x}-${y}`;
		this.matrixAutoUpdate = false;
		this.matrixWorldAutoUpdate = false;
		this.up.set(0, 0, 1);
		this.renderOrder = 0;
	}

	/**
	 * Override Obejct3D.traverse, change the callback param type to "this"
	 * @param callback callback
	 */
	public traverse(callback: (object: this) => void): void {
		callback(this);
		this.children.forEach((tile) => {
			tile.isTile && tile.traverse(callback);
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
				tile.isTile && tile.traverseVisible(callback);
			});
		}
	}

	/**
	 * Override Obejct3D.raycast, only test the tile is showing
	 */
	public raycast(raycaster: Raycaster, intersects: Intersection[]): void {
		if (this.showing && this.isTile) {
			super.raycast(raycaster, intersects);
		}
	}

	/**
	 * Tile Fade in
	 */
	// private _fadeIn() {
	// 	if (this.showing && Array.isArray(this.material)) {
	// 		this.material.forEach((mat) => {
	// 			if (mat.opacity < mat.userData.opacity) {
	// 				mat.opacity += 0.01;
	// 			}
	// 		});
	// 	}
	// 	return this;
	// }

	/**
	 * Load data
	 * @param loader Data loader
	 * @returns Has loaded? Promise<boolean>
	 */
	public load(loader: ITileLoader, minLevel: number, _maxLevel: number): Promise<boolean> {
		if (this.loadState != "empty") {
			return Promise.resolve(false);
		}
		// Don't load when tile.coord.z < minLeve
		if (this.coord.z < minLevel) {
			this._loadState = "loaded";
			this.showing = true;
			return Promise.resolve(false);
		}
		// Reset the abortController
		this._abortController = new AbortController();
		this._loadState = "loading";

		// Load data
		return new Promise((resolve) =>
			loader.load(this, () => {
				const parent = this.parent;
				// Parent is null mean the tile has dispose
				if (!parent) {
					return resolve(false);
				}

				this._loadState = "loaded";
				this._heightUpdate();

				// Save opacity for fade in
				this.material.forEach((material) => {
					material.userData.opacity = material.opacity;
					material.opacity -= 0.1;
				});

				//Show children and hide parent when all children has loaded
				const children = parent.children.filter((child) => child.isTile);
				const loaded = children.every((child) => child.loadState === "loaded");
				parent.showing = !loaded;
				children.forEach((child) => (child.showing = loaded));
				resolve(true);
			}),
		);
	}

	/**
	 * Height update
	 */
	private _heightUpdate() {
		this.maxZ = this.geometry.boundingBox?.max.z || 0;
		this.minZ = this.geometry.boundingBox?.min.z || 0;
		this.avgZ = (this.maxZ + this.minZ) / 2;
		return this;
	}

	/**
	 *  Abort download
	 */
	public loadAbort() {
		this._abortController.abort();
		return this;
	}

	/**
	 * Free the tile resources
	 * @param disposeSelf dispose self?
	 */
	public dispose(disposeSelf: boolean) {
		if (this.loadState != "empty" && disposeSelf && this.isTile) {
			this._loadState = "empty";
			this.loadAbort();
			this._dispose();
		}

		// remove all children recursionly
		this.children.forEach((tile) => tile.dispose(true));
		this.clear();

		return this;
	}

	private _dispose() {
		// dispose material
		if (Array.isArray(this.material)) {
			this.material.forEach((mat) => mat.dispose());
		}

		// dispose geometry
		this.geometry.dispose();
		this.geometry.groups = [];

		// fire dispose
		this.dispatchEvent({ type: "dispose" });
	}
}
