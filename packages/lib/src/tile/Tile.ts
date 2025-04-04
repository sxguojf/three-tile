/**
 *@description: LOD Tile mesh
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import {
	BaseEvent,
	Box3,
	BufferGeometry,
	Camera,
	Frustum,
	InstancedBufferGeometry,
	Intersection,
	Material,
	Matrix4,
	Mesh,
	Object3DEventMap,
	Raycaster,
	Vector3,
} from "three";
import { ITileLoader } from "../loader";
import { getDistance, getTileSize, createChildren, LODAction, LODEvaluate } from "./util";

const THREADSNUM = 10;

/**
 * Tile update parameters
 */
export type TileUpdateParames = {
	camera: Camera;
	loader: ITileLoader;
	minLevel: number;
	maxLevel: number;
	LODThreshold: number;
};

/**
 * Tile event map
 */
export interface TTileEventMap extends Object3DEventMap {
	unload: BaseEvent;
	ready: BaseEvent;
	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };
	"tile-unload": BaseEvent & { tile: Tile };
}

// Default geometry of tile
const defaultGeometry = new InstancedBufferGeometry();

const tempVec3 = new Vector3();
const tempMat4 = new Matrix4();
const tileBox = new Box3(new Vector3(-0.5, -0.5, 0), new Vector3(0.5, 0.5, 9));
const frustum = new Frustum();

/**
 * Class Tile, inherit of Mesh
 */
/**
 * Represents a tile in a 3D scene.
 * Extends the Mesh class with BufferGeometry and Material.
 */
export class Tile extends Mesh<BufferGeometry, Material[], TTileEventMap> {
	private static _downloadThreads = 0;

	/**
	 * Number of download threads.
	 */
	public static get downloadThreads() {
		return Tile._downloadThreads;
	}

	/** Coordinate of tile */
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;

	/** Is a tile? */
	public readonly isTile = true;

	/** Tile parent */
	public readonly parent: this | null = null;

	/** Children of tile */
	public readonly children: this[] = [];

	private _ready = false;

	/** return this.minLevel < map.minLevel, True mean do not needs load tile data */
	private _isDummy = false;
	public get isDummy() {
		return this._isDummy;
	}

	private _showing = false;

	/**
	 * Gets the showing state of the tile.
	 */
	public get showing() {
		return this._showing;
	}

	/**
	 * Sets the showing state of the tile.
	 * @param value - The new showing state.
	 */
	public set showing(value) {
		this._showing = value;
		this.material.forEach(mat => (mat.visible = value));
	}

	/** Max height of tile */
	private _maxZ = 0;
	/**
	 * Gets the maximum height of the tile.
	 */
	public get maxZ() {
		return this._maxZ;
	}

	/**
	 * Sets the maximum height of the tile.
	 * @param value - The new maximum height.
	 */
	protected set maxZ(value) {
		this._maxZ = value;
	}

	/** Distance to camera */
	public distToCamera = 0;

	/* Tile size in world */
	public sizeInWorld = 0;

	/**
	 * Gets the index of the tile in its parent's children array.
	 * @returns The index of the tile.
	 */
	public get index(): number {
		return this.parent ? this.parent.children.indexOf(this) : -1;
	}

	private _loaded = false;

	/**
	 * Gets the load state of the tile.
	 */
	public get loaded() {
		return this._loaded;
	}

	private _inFrustum = false;

	/** Is tile in frustum ?*/
	public get inFrustum() {
		return this._inFrustum;
	}

	/**
	 * Sets whether the tile is in the frustum.
	 * @param value - The new frustum state.
	 */
	protected set inFrustum(value) {
		this._inFrustum = value;
	}

	/** Tile is a leaf ?  */
	public get isLeaf(): boolean {
		return this.children.filter(child => child.isTile).length === 0;
	}

	/**
	 * Constructor for the Tile class.
	 * @param x - Tile X-coordinate, default: 0.
	 * @param y - Tile Y-coordinate, default: 0.
	 * @param z - Tile level, default: 0.
	 */
	public constructor(x = 0, y = 0, z = 0) {
		super(defaultGeometry, []);
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = `Tile ${z}-${x}-${y}`;
		this.up.set(0, 0, 1);
		this.matrixAutoUpdate = false;
	}

	/**
	 * Override Object3D.traverse, change the callback param type to "this".
	 * @param callback - The callback function.
	 */
	public traverse(callback: (object: this) => void): void {
		callback(this);
		this.children.forEach(tile => {
			tile.isTile && tile.traverse(callback);
		});
	}

	/**
	 * Override Object3D.traverseVisible, change the callback param type to "this".
	 * @param callback - The callback function.
	 */
	public traverseVisible(callback: (object: this) => void): void {
		if (this.visible) {
			callback(this);
			this.children.forEach(tile => {
				tile.isTile && tile.traverseVisible(callback);
			});
		}
	}

	/**
	 * Override Object3D.raycast, only test the tile has loaded.
	 * @param raycaster - The raycaster.
	 * @param intersects - The array of intersections.
	 */
	public raycast(raycaster: Raycaster, intersects: Intersection[]): void {
		if (this.showing && this.loaded && this.isTile) {
			super.raycast(raycaster, intersects);
		}
	}

	/**
	 * LOD (Level of Detail).
	 * @param loader - The tile loader.
	 * @param minLevel - The minimum level.
	 * @param maxLevel - The maximum level.
	 * @param threshold - The threshold.
	 * @returns this
	 */
	protected LOD(params: TileUpdateParames) {
		if (Tile.downloadThreads > THREADSNUM) {
			return { action: LODAction.none };
		}
		let newTiles: Tile[] = [];
		// LOD evaluate
		const { loader, minLevel, maxLevel, LODThreshold } = params;
		const action = LODEvaluate(this, minLevel, maxLevel, LODThreshold);
		if (action === LODAction.create) {
			newTiles = createChildren(loader, this.x, this.y, this.z);
			this.add(...newTiles);
		}
		return { action, newTiles };
	}

	/**
	 * Checks the visibility of the tile.
	 */
	// private _checkChildrenVisible() {
	// 	const children = this.children.filter((child) => child.isTile);
	// 	const allLoaded = children.every((child) => child.loaded);
	// 	this.showing = !allLoaded;
	// 	children.forEach((child) => (child.showing = allLoaded));
	// 	return this;
	// }
	/**
	 * Checks the visibility of the tile.
	 */
	private _checkVisible() {
		const parent = this.parent;
		if (parent && parent.isTile) {
			const children = parent.children.filter(child => child.isTile);
			const allLoaded = children.every(child => child.loaded);
			parent.showing = !allLoaded;
			children.forEach(child => (child.showing = allLoaded));
		}
		return this;
	}

	/**
	 * Asynchronously load tile data
	 *
	 * @param loader Tile loader
	 * @returns this
	 */
	private async _load(loader: ITileLoader): Promise<Tile> {
		Tile._downloadThreads++;
		const { x, y, z } = this;
		const meshData = await loader.load({
			x,
			y,
			z,
			bounds: [-Infinity, -Infinity, Infinity, Infinity],
		});
		this.material = meshData.materials;
		this.geometry = meshData.geometry;
		this.maxZ = this.geometry.boundingBox?.max.z || 0;
		this._loaded = true;
		Tile._downloadThreads--;
		return this;
	}

	/** New tile init */
	private _init() {
		this.updateMatrix();
		this.updateMatrixWorld();
		this.sizeInWorld = getTileSize(this);
	}
	/**
	 * Updates the tile.
	 * @param params - The update parameters.
	 * @returns this
	 */
	public update(params: TileUpdateParames) {
		console.assert(this.z === 0);
		if (!this.parent) {
			return this;
		}

		// Get camera frustum
		frustum.setFromProjectionMatrix(
			tempMat4.multiplyMatrices(params.camera.projectionMatrix, params.camera.matrixWorldInverse)
		);
		// Get camera position
		const cameraWorldPosition = params.camera.getWorldPosition(tempVec3);

		// LOD for tiles
		this.traverse(tile => {
			// shadow
			tile.receiveShadow = this.receiveShadow;
			tile.castShadow = this.castShadow;

			// Tile is in frustum?
			const bounds = tileBox.clone().applyMatrix4(tile.matrixWorld);
			tile.inFrustum = frustum.intersectsBox(bounds);

			// Get distance to camera
			tile.distToCamera = getDistance(tile, cameraWorldPosition);

			// LOD
			const { action, newTiles } = tile.LOD(params);

			this._doAction(tile, action, newTiles, params);
		});

		this._checkReady();
		return this;
	}

	private _doAction(currentTile: Tile, action: LODAction, newTiles: Tile[] | undefined, params: TileUpdateParames) {
		
		if (action === LODAction.create) {
			// Load new tiles data
			newTiles?.forEach(newTile => {
				newTile._init();
				newTile._isDummy = newTile.z < params.minLevel;
				this.dispatchEvent({ type: "tile-created", tile: newTile });
				if (!newTile.isDummy) {
					newTile._load(params.loader).then(() => {
						// Show tile when all children has loaded
						newTile._checkVisible();
						this.dispatchEvent({ type: "tile-loaded", tile: newTile });
					});
				}
			});
		} else if (action === LODAction.remove) {
			currentTile.showing = true;
			// unload children tiles
			currentTile._unLoad(false, params.loader);
			this.dispatchEvent({ type: "tile-unload", tile: currentTile });
		}
		return this;
	}

	/**
	 * Reloads the tile data.
	 * @returns this
	 */
	public reload(loader: ITileLoader) {
		this._unLoad(true, loader);
		return this;
	}

	/**
	 * Checks if the tile is ready to render.
	 * @returns this
	 */
	private _checkReady() {
		if (!this._ready) {
			this._ready = true;
			this.traverse(child => {
				if (child.isLeaf && child.loaded && !child.isDummy) {
					this._ready = false;
					return;
				}
			});
			if (this._ready) {
				this.dispatchEvent({ type: "ready" });
			}
		}
		return this;
	}

	/**
	 * UnLoads the tile data.
	 * @param unLoadSelf - Whether to unload tile itself.
	 * @returns this.
	 */
	private _unLoad(unLoadSelf: boolean, loader: ITileLoader) {
		if (unLoadSelf && this.isTile && !this.isDummy) {
			this.dispatchEvent({ type: "unload" });
			loader?.unload?.(this);
		}
		// remove all children recursively
		this.children.forEach(child => child._unLoad(true, loader));
		this.clear();
		return this;
	}
}
