/**
 *@description: Root Tile Class
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Box3, Camera, Frustum, Matrix4, Vector3 } from "three";
import { ITileLoader } from "../loader/ITileLoaders";
import { Tile } from "./Tile";
import { creatChildrenTile, getDistance, getTileSize, LODAction, LODEvaluate } from "./utils";

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
		this._tileTreeUpdate(camera);
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
	 *
	 * @returns this
	 */
	private _checkReady() {
		if (!this._ready) {
			this._ready = true;
			this.traverse((child) => {
				if (child.isLeaf && child.loaded && child.coord.z >= this.minLevel) {
					this._ready = false;
				}
			});
			if (this._ready) {
				this.dispatchEvent({ type: "ready" });
			}
		}
		return this;
	}

	/**
	 * Update tile tree use LOD
	 * @param camera  camera
	 *
	 * @returns this
	 */
	private _tileTreeUpdate(camera: Camera) {
		frustum.setFromProjectionMatrix(tempMat4.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
		const cameraWorldPosition = camera.getWorldPosition(tempVec3);

		// LOD for tiles
		this.traverse((tile) => {
			const bounds = tileBox.clone().applyMatrix4(tile.matrixWorld);
			tile.inFrustum = frustum.intersectsBox(bounds);
			// Get the distance of camera to tile
			tile.distToCamera = getDistance(tile, cameraWorldPosition);
			this.LOD(tile);
		});
		return this;
	}

	private LOD(tile: Tile) {
		// LOD evaluate
		const action = LODEvaluate(tile, this.minLevel, this.maxLevel, this.LODThreshold);
		if (action === LODAction.create && (tile.showing || tile.coord.z < this.minLevel)) {
			const newTiles = creatChildrenTile(this, tile, (newTile: Tile) => {
				// onload
				this.calcHeightInView();
				tile.receiveShadow = this.receiveShadow;
				tile.castShadow = this.castShadow;
				this.dispatchEvent({ type: "tile-loaded", tile: newTile });
			});
			newTiles.forEach((newTile) => {
				this.dispatchEvent({ type: "tile-created", tile: newTile });
			});
		} else if (action === LODAction.remove) {
			const parent = tile.parent;
			if (parent?.isTile && !parent.showing) {
				parent.dispose(false);
				parent.showing = true;
			}
		}
		return this;
	}

	/**
	 * Calculate the elevation of tiles in view
	 *
	 * @returns this
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

// function createTile(root: RootTile, x: number, y: number, z: number, position: Vector3, scale: Vector3) {
// 	const tile =
// 		z < root.minLevel
// 			? new Tile(x, y, z)
// 			: root.loader.load1(x, y, z, () => {
// 					// Parent is null mean the tile has dispose
// 					if (!tile.parent) {
// 						return;
// 					}
// 					tile.onLoaded();
// 					tile.receiveShadow = root.receiveShadow;
// 					tile.castShadow = root.castShadow;

// 					root.calcHeightInView();
// 					root.dispatchEvent({ type: "tile-loaded", tile });
// 			  });
// 	tile.position.copy(position);
// 	tile.scale.copy(scale);
// 	root.dispatchEvent({ type: "tile-created", tile });
// 	return tile;
// }

// function creatChildrenTile(root: RootTile, parent: Tile) {
// 	const level = parent.coord.z + 1;
// 	const x = parent.coord.x * 2;
// 	const z = 0;
// 	const pos = 0.25;
// 	// Tow childdren at level 0 when GWS projection
// 	if (parent.coord.z === 0 && root.isWGS) {
// 		const y = parent.coord.y;
// 		const scale = new Vector3(0.5, 1.0, 1.0);
// 		parent.add(createTile(root, x, y, level, new Vector3(-pos, 0, z), scale)); //left
// 		parent.add(createTile(root, x + 1, y, level, new Vector3(pos, 0, z), scale)); //right
// 	} else {
// 		const y = parent.coord.y * 2;
// 		const scale = new Vector3(0.5, 0.5, 1.0);
// 		parent.add(createTile(root, x, y + 1, level, new Vector3(-pos, -pos, z), scale)); //left-bottom
// 		parent.add(createTile(root, x + 1, y + 1, level, new Vector3(pos, -pos, z), scale)); // right-bottom
// 		parent.add(createTile(root, x, y, level, new Vector3(-pos, pos, z), scale)); //left-top
// 		parent.add(createTile(root, x + 1, y, level, new Vector3(pos, pos, z), scale)); //right-top
// 	}
// 	parent.children.forEach((child) => {
// 		child.updateMatrix();
// 		child.updateMatrixWorld();
// 		child.sizeInWorld = getTileSize(child);
// 	});
// 	return parent.children;
// }
