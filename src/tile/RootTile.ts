/**
 *@description: Root Tile Class
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Box3, Camera, Frustum, Matrix4, Vector3 } from "three";
import { ITileLoader } from "../loader/ITileLoaders";
import { Tile } from "./Tile";

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
	private _autoLoad = true;
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
	 * Is the map WGS projection
	 */
	public isWGS = false;

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
	 * Get whether allow tile data to update, default true.
	 */
	public get autoLoad(): boolean {
		return this._autoLoad;
	}

	/**
	 * Set whether allow tile data to update, default true.
	 * true: Load data on the scene update every frame it is rendered.
	 * false: Do not load data, only update tile tree.
	 */
	public set autoLoad(value: boolean) {
		this._autoLoad = value;
	}

	/**
	 * Constructor
	 * @param loader tile data loader
	 * @param level tile level, default:0
	 * @param x tile X-coordinate, default:0
	 * @param y tile y-coordinate, default:0
	 */
	public constructor(loader: ITileLoader, level = 0, x = 0, y = 0) {
		super(level, x, y);
		this.visible = false;
		this._loader = loader;
		this.matrixAutoUpdate = true;
		this.matrixWorldAutoUpdate = true;
	}

	/**
	 * Check the map is ready to render
	 *
	 * @returns this
	 */
	private _checkReady() {
		if (!this._ready) {
			this._ready = true;
			this.traverse((child) => {
				if (child.isLeaf && child.loadState != "loaded") {
					this._ready = false;
				}
			});
			if (this._ready) {
				console.log("Map ready!!!");
				this.visible = true;
				this.dispatchEvent({ type: "ready" });
			}
		}
		return this;
	}

	/**
	 * Update tile tree and tile data. It called on the scene update every frame.
	 * @param camera
	 */
	public update(camera: Camera) {
		this._updateTileTree(camera);
		if (this.autoLoad) {
			this._updateTileData();
		}
		if (!this._ready) {
			this._checkReady();
		}
		return this;
	}

	/**
	 * Reload data, Called to take effect after source has changed
	 */
	public reload() {
		this.dispose(true);
		return this;
	}

	/**
	 * Update tile tree use LOD
	 * @param camera  camera
	 * @returns  the tile tree has changed
	 */
	private _updateTileTree(camera: Camera) {
		let change = false;
		frustum.setFromProjectionMatrix(tempMat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
		const cameraWorldPosition = camera.getWorldPosition(tempVec3);

		// LOD for tiles
		this.traverse((tile) => {
			if (tile.isTile) {
				// Issues: https://github.com/mrdoob/three.js/issues/27756
				const bounds = tileBox.clone().applyMatrix4(tile.matrixWorld);
				tile.inFrustum = frustum.intersectsBox(bounds);

				// LOD to get new tiles
				const newTiles = tile._LOD(
					cameraWorldPosition,
					this.minLevel,
					this.maxLevel,
					this.LODThreshold,
					this.isWGS,
				);

				// Fire event on the tile created
				if (newTiles.length > 0) {
					newTiles.forEach((tile) => {
						this.dispatchEvent({ type: "tile-created", tile });
					});
					change = true;
				}
			}
		});

		return change;
	}

	/**
	 *  Update tileTree data
	 */
	private _updateTileData() {
		// Tiles are sorted by distance to camera
		let tiles: Tile[] = [];
		this.traverse((tile) => {
			if (tile.isTile && tile.loadState === "empty") {
				tiles.push(tile);
			}
		});
		if (tiles.length > 0) {
			// tiles = tiles.sort((a, b) => b.coord.z - a.coord.z);
			tiles = tiles.sort((a, b) => {
				const inFrustumA = a.inFrustum ? 1 : 100;
				const inFrustumB = b.inFrustum ? 1 : 100;
				return a.distFromCamera * inFrustumA - b.distFromCamera * inFrustumB;
			});

			// Iterate through the tiles to load data
			tiles.forEach((tile) => {
				tile.load(this.loader, this.minLevel, this.maxLevel).then(() => {
					if (tile.loadState === "loaded") {
						this._updateHight();
						this.dispatchEvent({ type: "tile-loaded", tile });
					}
				});
			});
			console.log(tiles.length);
		}

		// this.traverse(async (tile) => {
		// 	if (tile.isTile && tile.loadState === "empty") {
		// 		await tile.load(this.loader, this.minLevel, this.maxLevel);
		// 		this._updateHight();
		// 		this.dispatchEvent({ type: "tile-loaded", tile });
		// 	}
		// });

		return this;
	}

	/**
	 * Update height of tiles in view
	 */
	private _updateHight() {
		let sumZ = 0,
			count = 0;
		this.maxZ = 0;
		this.minZ = 9000;
		this.traverse((child) => {
			if (child.isTile && child.isLeaf && child.inFrustum && child.loadState === "loaded") {
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
