/**
 *@description: RootTileClass
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Box3, Camera, Frustum, Matrix4, Vector3 } from "three";
import { ITileLoader } from "../loader/ITileLoaders";
import { Tile } from ".";

const tempMat4 = new Matrix4();
const frustum = new Frustum();

/**
 * Root tile, it is a  QuadTree extends Tile.
 * note: update() function is called on the scene update every frame it is rendered.
 */
export class RootTile extends Tile {
	private _treeReadyCount = 0;
	private _autoLoad = true;
	private _loader: ITileLoader;
	private _minLevel = 0;

	/**
	 * Get the map minLevel
	 */
	public get minLevel() {
		return this._minLevel;
	}
	/**
	 * Set the map minLevel,
	 */
	public set minLevel(value) {
		this._minLevel = value;
	}

	private _maxLevel = 19;
	/**
	 * Get the map maxLevel
	 */
	public get maxLevel() {
		return this._maxLevel;
	}
	/**
	 * Set the map maxLevel
	 */
	public set maxLevel(value) {
		this._maxLevel = value;
	}

	private _LODThreshold = 1;
	/**
	 * Get the map LOD threshold
	 */
	public get LODThreshold() {
		return this._LODThreshold;
	}
	/**
	 * Set the map LOD threshold
	 */
	public set LODThreshold(value) {
		this._LODThreshold = value;
	}

	/**
	 * Is the map WGS projection
	 */
	public isWGS = false;

	/**
	 * Get the tile loader
	 */
	public get loader(): ITileLoader {
		return this._loader;
	}
	/**
	 * Set the tile loader
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
	 * true: auto load data on the scene update every frame it is rendered.
	 * false: only update quad tree on render.
	 */
	public set autoLoad(value: boolean) {
		this._autoLoad = value;
	}

	private _vierwerBufferSize = 0.6;

	// tile bounds, used to decide the tile in frustum, it greater than tile size to cache
	private _tileBox = new Box3(
		new Vector3(-this.viewerbufferSize, -this.viewerbufferSize, 0),
		new Vector3(this.viewerbufferSize, this.viewerbufferSize, 10),
	);

	/**
	 * Get the renderer cache size scale. (0.5-2.5，default: 0.6)
	 */
	public get viewerbufferSize() {
		return this._vierwerBufferSize;
	}
	/**
	 * Get the renderer cache size. (0.5-2.5，default: 0.6)
	 */
	public set viewerbufferSize(value) {
		this._vierwerBufferSize = Math.min(Math.max(value, 0.5), 2.5);
		this._tileBox = new Box3(
			new Vector3(-this.viewerbufferSize, -this.viewerbufferSize, 0),
			new Vector3(this.viewerbufferSize, this.viewerbufferSize, 9),
		);
	}

	/**
	 * constructor
	 * @param loader tile data loader
	 * @param level tile level, default:0
	 * @param x tile X-coordinate, default:0
	 * @param y tile y-coordinate, default:0
	 */
	public constructor(loader: ITileLoader, level: number = 0, x: number = 0, y: number = 0) {
		super(level, x, y);
		this._loader = loader;
		this.matrixAutoUpdate = true;
		this.matrixWorldAutoUpdate = true;
	}

	/**
	 * update the quadTree and tile data
	 * @param camera
	 */
	public update(camera: Camera) {
		// update quadTree
		if (this._updateTileTree(camera)) {
			this._treeReadyCount = 0;
		} else {
			this._treeReadyCount = Math.min(this._treeReadyCount + 1, 100);
		}

		// update tile data when quadTree is steady
		if (this.autoLoad && this._treeReadyCount > 2) {
			this._updateTileData();
		}
		return this;
	}

	/**
	 * reload data, Called to take effect after source is modified
	 */
	public reload() {
		this.dispose(true);
		return this;
	}

	/**
	 * update the tile tree use LOD
	 * @param cameraWorldPosition positon of the camera
	 * @returns  the tile tree has changed
	 */
	private _updateTileTree(camera: Camera) {
		let change = false;

		// get the pitch of camera
		// this._pitch = camera
		//     .getWorldDirection(tempVec3)
		//     .angleTo(new Vector3(0, 0, -1).applyMatrix4(this.matrixWorld));

		// get the frustum of map
		frustum.setFromProjectionMatrix(tempMat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

		// LOD for tiles
		this.traverse((tile) => {
			if (tile.isTile) {
				tile.geometry.computeBoundingBox();
				tile.geometry.computeBoundingSphere();

				// is the tile in the frustum?
				tile.inFrustum = frustum.intersectsBox(this._tileBox.clone().applyMatrix4(tile.matrixWorld));

				// LOD, get new tiles
				const newTiles = tile._lod(camera, this.minLevel, this.maxLevel, this.LODThreshold, this.isWGS);

				newTiles.forEach((newTile) => {
					// fire event on the tile created
					this.dispatchEvent({ type: "tile-created", tile: newTile });
				});

				if (newTiles.length > 0) {
					change = true;
				}
			}
		});

		return change;
	}

	/**
	 *  update tileTree data.
	 *  traverse the tiles to load data and update tiles visible.
	 */
	private _updateTileData() {
		//  traverse the tiles
		this.traverse((tile) => {
			if (tile.isTile) {
				// load data
				tile._load(this.loader).then((check) => {
					if (check) {
						// && tile.loadState === "loaded"
						const loaded = this._updateVisible();
						if (loaded) {
							// fire loaded all tile has loaded
							this.dispatchEvent({ type: "loaded", tile });
							console.log("ok");
						}
						// update z of map in view
						this._updateVisibleZ();
					}
					// fire event of the tile loaded
					this.dispatchEvent({ type: "tile-loaded", tile });
				});
			}
		});

		return this;
	}

	/**
	 * update the tile visible when tile loaded
	 * @returns all of tile has loaded?
	 */
	private _updateVisible() {
		const leafLoaded = (tile: Tile): boolean => {
			if (!tile.inFrustum) {
				return true;
			}
			// is loaed when load state is loaded or not in frustum, if the tile is leaf
			if (tile.isLeaf) {
				return tile.loadState === "loaded";
			}

			// recursion to decide the tile has loaded, if the tile not is leaf
			const loaded = tile.children.every((child) => leafLoaded(child));

			// show leaf tile and free parent tile if all of tile has loade
			if (loaded) {
				tile.children.forEach((child) => {
					if (child.inFrustum) {
						if (child.isLeaf) {
							child.isTemp = false;
						} else {
							// child.isTemp = true;
							child.dispose(false);
						}
					}
				});
			}
			// console.log(loaded);

			return loaded;
		};

		//console.log("------------");
		return leafLoaded(this);
	}

	/**
	 * update the tiles height
	 */
	private _updateVisibleZ() {
		let sumZ = 0,
			count = 0;
		this.maxZ = 0;
		this.minZ = 9000;
		this.traverse((tile) => {
			if (tile.isTile && tile.isLeafInFrustum && tile.loadState === "loaded") {
				this.maxZ = Math.max(this.maxZ, tile.maxZ);
				this.minZ = Math.min(this.minZ, tile.minZ);
				sumZ += tile.avgZ;
				count++;
			}
		});
		if (count > 0) {
			this.avgZ = sumZ / count;
		}
	}
}