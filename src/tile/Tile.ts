/**
 *@description: Tile of map
 *@author: Guojf
 *@date: 2023-04-05
 */

import {
	BaseEvent,
	BufferGeometry,
	InstancedBufferGeometry,
	Intersection,
	Material,
	Mesh,
	Object3DEventMap,
	Raycaster,
	Vector3,
} from "three";
import { creatChildrenTile, LODAction, LODEvaluate } from "./utils";
import { ITileLoader } from "../loader";

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
// export type LoadState = "empty" | "loading" | "loaded";

/**
 * Type of coordinate of tile
 */
export type TileCoord = { x: number; y: number; z: number };

// Default geometry of tile
const defaultGeometry = new InstancedBufferGeometry();

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

	public distToCamera = 0;

	private _showing = false;
	private _inFrustum = false;
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
	public get loaded() {
		return this.material.length > 0;
	}

	/** Is tile in frustum ?*/
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
			this.material.forEach((mat) => (mat.visible = value));
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
		super(defaultGeometry, []);
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

	// private LOD2(loader: ITileLoader, minLevel: number, maxLevel: number, LODThreshold: number): Promise<boolean> {
	// 	// LOD evaluate
	// 	const action = LODEvaluate(this, minLevel, maxLevel, LODThreshold);
	// 	if (action === LODAction.create && (this.showing || this.coord.z < minLevel)) {
	// 		const newTiles = creatChildrenTile(loader, this, (newTile: Tile) => {
	// 			// this.calcHeightInView();
	// 			// tile.receiveShadow = this.receiveShadow;
	// 			// tile.castShadow = this.castShadow;
	// 			// this.dispatchEvent({ type: "tile-loaded", tile: newTile });
	// 			newTile.onLoaded();
	// 		});
	// 		newTiles.forEach((newTile) => {
	// 			this.dispatchEvent({ type: "tile-created", tile: newTile });
	// 		});
	// 	} else if (action === LODAction.remove) {
	// 		const parent = tile.parent;
	// 		if (parent?.isTile && !parent.showing) {
	// 			parent.dispose(false);
	// 			parent.showing = true;
	// 		}
	// 	}
	// 	return this;
	// }

	// /**
	//  * Level Of Details
	//  * @param cameraWorldPosition
	//  * @param minLevel min level of map
	//  * @param maxLevel max level of map
	//  * @param threshold threshold for LOD
	//  * @param isWGS is WGS projection?
	//  * @returns  new tiles and old tiles to remove
	//  */
	// protected _LOD1(
	// 	cameraWorldPosition: Vector3,
	// 	minLevel: number,
	// 	maxLevel: number,
	// 	threshold: number,
	// 	isWGS: boolean,
	// ) {
	// 	let newTiles: Tile[] = [];
	// 	let oldTiles: Tile | null = null;
	// 	this.distToCamera = getDistToCamera(this, cameraWorldPosition);
	// 	// LOD evaluate
	// 	const action = LODEvaluate(this, minLevel, maxLevel, threshold);
	// 	if (action === LODAction.create && (this.showing || this.coord.z < minLevel)) {
	// 		newTiles = creatChildrenTile(this, isWGS);
	// 	} else if (action === LODAction.remove) {
	// 		const parent = this.parent;
	// 		if (parent?.isTile && !parent.showing) {
	// 			oldTiles = parent;
	// 			parent.showing = true;
	// 		}
	// 	}
	// 	return { newTiles, oldTiles };
	// }

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
	// public load(loader: ITileLoader, minLevel: number, _maxLevel: number): Promise<boolean> {
	// 	if (this.loadState != "empty") {
	// 		return Promise.resolve(false);
	// 	}
	// 	// Don't load when tile.coord.z < minLeve
	// 	if (this.coord.z < minLevel) {
	// 		this._loadState = "loaded";
	// 		this.showing = true;
	// 		return Promise.resolve(false);
	// 	}
	// 	this._loadState = "loading";

	// 	// Load data
	// 	return new Promise((resolve) =>
	// 		loader.load(this, () => {
	// 			const parent = this.parent;
	// 			// Parent is null mean the tile has dispose
	// 			if (!parent) {
	// 				return resolve(false);
	// 			}

	// 			this._loadState = "loaded";
	// 			this._heightUpdate();

	// 			// Save opacity for fade in
	// 			this.material.forEach((material) => {
	// 				material.userData.opacity = material.opacity;
	// 				material.opacity -= 0.1;
	// 			});

	// 			//Show children and hide parent when all children has loaded
	// 			const children = parent.children.filter((child) => child.isTile);
	// 			const loaded = children.every((child) => child.loadState === "loaded");
	// 			parent.showing = !loaded;
	// 			children.forEach((child) => (child.showing = loaded));
	// 			resolve(true);
	// 		}),
	// 	);
	// }

	public onLoaded() {
		// this._loaded = true;
		// const parent = this.parent;
		// if (parent && parent.isTile) {
		// 	//Show children and hide parent when all children has loaded
		// 	const children = parent.children.filter((child) => child.isTile);
		// 	const loaded = children.every((child) => child.loaded);
		// 	parent.showing = !loaded;
		// 	children.forEach((child) => (child.showing = loaded));

		// 	// Update Z
		this._heightUpdate();
		// }
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
		if (this.loaded && disposeSelf && this.isTile) {
			this.loadAbort();
			this.dispatchEvent({ type: "dispose" });
		}

		// remove all children recursionly
		this.children.forEach((child) => child.dispose(true));
		this.clear();

		return this;
	}
}
