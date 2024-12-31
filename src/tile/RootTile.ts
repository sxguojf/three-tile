/**
 *@description: Root Tile Class
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Box3, Camera, Frustum, Matrix4, Vector3 } from "three";
import { ITileLoader } from "../loader/ITileLoaders";
import { Tile } from "./Tile";
import { creatChildrenTile, getDistance, LODAction, LODEvaluate } from "./util";

// export interface RootTileEventMap extends TileEventMap {
// 	tileCreated: { type: "tile-created" };
// 	tileLoadError: { type: "tile-load-error" };
// 	tileLoaded: { type: "tile-loaded" };
// }

// export interface RootTileEventMap {
// 	ready: { type: "reay" };
// }

const tempVec3 = new Vector3();
const tempMat4 = new Matrix4();
const tileBox = new Box3(new Vector3(-0.5, -0.5, 0), new Vector3(0.5, 0.5, 9));
const frustum = new Frustum();

/**
 * Root tile, inherit of Tile
 */
export class RootTile extends Tile {
	private _loader: ITileLoader;
	private _minLevel = 0;
	private _maxLevel = 19;
	private _ready = false;

	/**
	 * Get minLevel of the map
	 */
	public get minLevel() {
		return this._minLevel;
	}
	/**
	 * Set minLevel of the map,
	 */
	public set minLevel(value) {
		this._minLevel = value;
	}

	/**
	 * Get maxLevel of the map
	 */
	public get maxLevel() {
		return this._maxLevel;
	}
	/**
	 * Set  maxLevel of the map
	 */
	public set maxLevel(value) {
		this._maxLevel = value;
	}

	private _LODThreshold = 1;
	/**
	 * Get LOD threshold
	 */
	public get LODThreshold() {
		return this._LODThreshold;
	}
	/**
	 * Set LOD threshold
	 */
	public set LODThreshold(value) {
		this._LODThreshold = value;
	}

	/**
	 * Get tile loader
	 */
	public get loader(): ITileLoader {
		return this._loader;
	}
	/**
	 * Set tile loader
	 */
	public set loader(value: ITileLoader) {
		this._loader = value;
	}

	/**
	 * Constructor
	 * @param loader tile data loader
	 * @param z tile level, default:0
	 * @param x tile X-coordinate, default:0
	 * @param y tile y-coordinate, default:0
	 */
	public constructor(loader: ITileLoader, z = 0, x = 0, y = 0) {
		super(z, x, y);
		this._loader = loader;
		this.matrixAutoUpdate = true;
		this.matrixWorldAutoUpdate = true;
	}

	/**
	 * Update tile tree and tile data. It called on the scene update every frame.
	 * @param camera
	 *
	 * @returns this
	 */
	public update(camera: Camera) {
		// Get camera frustum
		frustum.setFromProjectionMatrix(tempMat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
		// Get camera postion
		const cameraWorldPosition = camera.getWorldPosition(tempVec3);

		// LOD for tiles
		this.traverse((tile) => {
			const bounds = tileBox.clone().applyMatrix4(tile.matrixWorld);
			// Tile is in frustum?
			tile.inFrustum = frustum.intersectsBox(bounds);
			// Get the distance of camera to tile
			tile.distToCamera = getDistance(tile, cameraWorldPosition);
			// LOD
			this._LOD(tile);
		});

		//Fire "ready" event when ready
		this._checkReady();
		return this;
	}

	/**
	 * Reload data, Called to take effect after source has changed
	 */
	public reload() {
		this.dispose(false);
		return this;
	}

	/**
	 * Check the map is ready to render
	 */
	private _checkReady() {
		if (!this._ready) {
			this._ready = true;
			this.traverse((child) => {
				if (child.isLeaf && child.loaded && child.z >= this.minLevel) {
					this._ready = false;
				}
			});
			if (this._ready) {
				this.dispatchEvent({ type: "ready" });
			}
		}
		return this;
	}

	private _LOD(tile: Tile) {
		// LOD evaluate
		const action = LODEvaluate(tile, this.minLevel, this.maxLevel, this.LODThreshold);
		if (action === LODAction.create && (tile.loaded || tile.z < this.minLevel)) {
			// Create children tiles
			const newTiles = creatChildrenTile(tile, this.loader, this.minLevel, (newTile: Tile) => {
				// onload
				newTile.onLoaded();
				this.calcHeightInView();
				this.dispatchEvent({ type: "tile-loaded", tile: newTile });
			});
			newTiles.forEach((newTile) => {
				this.dispatchEvent({ type: "tile-created", tile: newTile });
			});
		} else if (action === LODAction.remove) {
			// Remove tiles
			const parent = tile.parent;
			if (parent?.isTile) {
				parent.dispose(false);
			}
		}
		return this;
	}

	/**
	 * Calculate the elevation of tiles in view
	 */
	public calcHeightInView() {
		let sumZ = 0,
			count = 0;
		this.maxZ = 0;
		this.minZ = 9000;
		this.traverse((child) => {
			if (child.isLeaf && child.inFrustum && child.loaded) {
				this.maxZ = Math.max(this.maxZ, child.maxZ);
				this.minZ = Math.min(this.minZ, child.minZ);
				sumZ += child.avgZ;
				count++;
			}
		});
		if (count > 0) {
			this.avgZ = sumZ / count;
		}
		return this;
	}
}
