/**
 *@description: LOD Tile mesh
 *@author: Guojf
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
import { getDistance, getTileSize, loadChildren, LODAction, LODEvaluate } from "./util";

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
	dispose: BaseEvent;
	ready: BaseEvent;
	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };
}

// Default geometry of tile
const defaultGeometry = new InstancedBufferGeometry();

const tempVec3 = new Vector3();
const tempMat4 = new Matrix4();
const tileBox = new Box3(new Vector3(-0.5, -0.5, 0), new Vector3(0.5, 0.5, 9));
const frustum = new Frustum();
// let downloadingCount = 0;
/**
 * Class Tile, inherit of Mesh
 */
export class Tile extends Mesh<BufferGeometry, Material[], TTileEventMap> {
	private static downloadThreads = 0;

	/** Coordinate of tile */
	public readonly x;
	public readonly y;
	public readonly z;

	/** Is a tile? */
	public readonly isTile = true;

	/** Tile parent */
	public readonly parent: this | null = null;

	/** Children of tile */
	public readonly children: this[] = [];

	private _showing = false;
	public get showing() {
		return this._showing;
	}
	public set showing(value) {
		this._showing = value;
		this.material.forEach((mat) => (mat.visible = value));
	}

	private _ready = false;

	/** Max height of tile */
	private _maxZ = 0;
	public get maxZ() {
		return this._maxZ;
	}
	protected set maxZ(value) {
		this._maxZ = value;
	}

	/** Min height of tile */
	private _minZ = 0;
	public get minZ() {
		return this._minZ;
	}
	protected set minZ(value) {
		this._minZ = value;
	}

	/** Avg height of tile */
	private _avgZ = 0;
	public get avgZ() {
		return this._avgZ;
	}
	protected set avgZ(value) {
		this._avgZ = value;
	}

	/** Distance to camera */
	public distToCamera = 0;

	/* Tile size in world */
	public sizeInWorld = 0;

	/** Index of tile, mean positon in parent.  (0:left-top, 1:right-top, 2:left-bottom, 3:right-bottom，-1:parent is null）*/
	public get index(): number {
		return this.parent ? this.parent.children.indexOf(this) : -1;
	}

	private _loaded = false;

	/** Get load state */
	public get loaded() {
		//return this.material.length > 0;
		return this._loaded;
	}

	private _inFrustum = false;
	/** Is tile in frustum ?*/
	public get inFrustum() {
		return this._inFrustum;
	}

	/** Set tile is in frustum */
	protected set inFrustum(value) {
		this._inFrustum = value;
	}

	/** Tile is a leaf ?  */
	public get isLeaf(): boolean {
		return this.children.filter((child) => child.isTile).length === 0;
	}

	/**
	 * constructor
	 * @param x tile X-coordinate, default:0
	 * @param y tile X-coordinate, default:0
	 * * @param z tile level, default:0
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
	 * Override Obejct3D.raycast, only test the tile has loaded
	 */
	public raycast(raycaster: Raycaster, intersects: Intersection[]): void {
		if (this.showing && this.loaded && this.isTile) {
			super.raycast(raycaster, intersects);
		}
	}

	/**
	 * LOD（Level of Detail）。
	 *
	 * @param loader
	 * @param minLevel
	 * @param maxLevel
	 * @param threshold
	 * @param onCreate
	 * @param onLoad
	 * @returns
	 */
	protected LOD(
		loader: ITileLoader,
		minLevel: number,
		maxLevel: number,
		threshold: number,
		onCreate: (tile: Tile) => void,
		onLoad: (tile: Tile) => void,
	) {
		// LOD evaluate
		const action = LODEvaluate(this, minLevel, maxLevel, threshold);
		if (Tile.downloadThreads < 6 && action === LODAction.create && (this.showing || this.z < minLevel)) {
			// Create children tiles
			const newTiles = loadChildren(loader, this.x, this.y, this.z, minLevel, (newTile: Tile) => onLoad(newTile));
			this.add(...newTiles);
			newTiles.forEach((newTile) => onCreate(newTile));
			// console.log(Tile.downloadThreads);
		} else if (action === LODAction.remove && this.showing) {
			// Remove tiles
			const parent = this.parent;
			if (parent?.isTile) {
				parent.showing = true;
				parent.dispose(false);
			}
		}
		return this;
	}

	public update(params: TileUpdateParames) {
		// Get camera frustum
		frustum.setFromProjectionMatrix(
			tempMat4.multiplyMatrices(params.camera.projectionMatrix, params.camera.matrixWorldInverse),
		);
		// Get camera postion
		const cameraWorldPosition = params.camera.getWorldPosition(tempVec3);

		// LOD for tiles
		this.traverse((tile) => {
			const bounds = tileBox.clone().applyMatrix4(tile.matrixWorld);
			// Tile is in frustum?
			tile.inFrustum = frustum.intersectsBox(bounds);
			// Get the distance of camera to tile
			tile.distToCamera = getDistance(tile, cameraWorldPosition);
			// LOD
			tile.LOD(
				params.loader,
				params.minLevel,
				params.maxLevel,
				params.LODThreshold,
				this._onTileCreate.bind(this),
				this._onTileLoad.bind(this),
			);
		});

		this._checkReady(params.minLevel);
		return this;
	}

	/**
	 * Check the map is ready to render
	 */
	private _checkReady(minLevel: number) {
		if (!this._ready) {
			this._ready = true;
			this.traverse((child) => {
				if (child.isLeaf && child.loaded && child.z >= minLevel) {
					this._ready = false;
				}
			});
			if (this._ready) {
				this.dispatchEvent({ type: "ready" });
			}
		}
		return this;
	}

	/** Called when tile loaded  */
	private _onLoad() {
		this._loaded = true;
		this._checkVisible();
		// Update Z
		this.maxZ = this.geometry.boundingBox?.max.z || 0;
		this.minZ = this.geometry.boundingBox?.min.z || 0;
		this.avgZ = (this.maxZ + this.minZ) / 2;
	}

	/**
	 * Calculate the elevation of tiles in view
	 */
	private _calcHeightInView() {
		let sumZ = 0,
			count = 0;
		this.maxZ = -1;
		this.minZ = 10;
		this.traverseVisible((child) => {
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

	private _checkVisible() {
		const parent = this.parent;
		if (parent && parent.isTile) {
			//Show children and hide parent when all children has loaded
			const children = parent.children.filter((child) => child.isTile);
			const loaded = children.every((child) => child.loaded);
			parent.showing = !loaded;
			children.forEach((child) => (child.showing = loaded));
		}
	}

	/**
	 * Callback function triggered when a tile is created
	 *
	 * @param newTile The newly created tile object
	 */
	private _onTileCreate(newTile: Tile) {
		newTile.updateMatrix();
		newTile.updateMatrixWorld();
		newTile.sizeInWorld = getTileSize(newTile);
		newTile.receiveShadow = this.receiveShadow;
		newTile.castShadow = this.castShadow;
		this.dispatchEvent({ type: "tile-created", tile: newTile });
		Tile.downloadThreads++;
	}

	/**
	 * Callback function triggered when a tile is loaded completely
	 *
	 * @param newTile The loaded tile object
	 */
	private _onTileLoad(newTile: Tile) {
		newTile._onLoad();
		this._calcHeightInView();
		this.dispatchEvent({ type: "tile-loaded", tile: newTile });
		Tile.downloadThreads--;
	}

	/**
	 * Reload data
	 */
	public reload() {
		this.dispose(true);
		Tile.downloadThreads = 0;
		return this;
	}

	/**
	 * Free the tile resources
	 * @param disposeSelf dispose self?
	 */
	public dispose(disposeSelf: boolean) {
		if (disposeSelf && this.isTile && this.loaded) {
			this.material.forEach((mat) => mat.dispose());
			this.material = [];
			this.geometry.groups = [];
			this.geometry.dispose();
			this.dispatchEvent({ type: "dispose" });
		}
		// remove all children recursionly
		this.children.forEach((child) => child.dispose(true));
		this.clear();
		return this;
	}
}
