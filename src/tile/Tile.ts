/**
 *@description: map tile
 *@author: Guojf
 *@date: 2023-04-05
 */

import {
	BaseEvent,
	BufferGeometry,
	Intersection,
	Material,
	Mesh,
	MeshBasicMaterial,
	Object3DEventMap,
	PlaneGeometry,
	Raycaster,
	Vector3,
} from "three";
import { ITileLoader } from "../loader/ITileLoaders";
import { LODAction, LODEvaluate } from "./LODEvaluate";
import { creatChildrenTile } from "./tileCreator";

/**
 * Tile event map
 */
export interface TTileEventMap extends Object3DEventMap {
	dispose: BaseEvent;
	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };
	ready: BaseEvent;
}

// Default geometry of tile
const defaultGeometry = new PlaneGeometry(1, 1);

// Default material of tile
const defaultMaterial = new MeshBasicMaterial({ color: 0xff0000, visible: false, transparent: true });

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

	// public isMesh: boolean = true;

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

	private _inFrustum = false;

	/** Tile is tile in frustum? */
	public get inFrustum() {
		return this._inFrustum;
	}

	/** Set tile is in frustum or not */
	protected set inFrustum(value) {
		this._inFrustum = value;
	}

	public get isDefault() {
		return this.material[0] === defaultMaterial;
	}

	private _showing = false;
	public get showing() {
		return this._showing;
	}
	public set showing(value) {
		if (!this.isDefault) {
			this._showing = value;
			this.material.forEach((mat) => mat != defaultMaterial && (mat.visible = value));
		}
	}

	/** Tile is a leaf?  */
	public get isLeaf() {
		return this.children.length === 0;
	}

	private _sizeInWorld = -1;
	/** Get tile diagonal length of tile in world */
	public get sizeInWorld() {
		if (this._sizeInWorld > 0) {
			return this._sizeInWorld;
		} else {
			const lt = new Vector3(-0.5, -0.5, 0).applyMatrix4(this.matrixWorld);
			const rt = new Vector3(0.5, 0.5, 0).applyMatrix4(this.matrixWorld);
			return lt.sub(rt).length();
		}
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

	public raycast(raycaster: Raycaster, intersects: Intersection[]): void {
		if (this.showing && this.loadState === "loaded") {
			super.raycast(raycaster, intersects);
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
		const action = LODEvaluate(this, minLevel, maxLevel, threshold);
		if (action === LODAction.create) {
			newTiles = creatChildrenTile(this, isWGS);
			// this.abortLoad();
		} else if (action === LODAction.remove) {
			const parent = this.parent;
			if (parent?.isTile) {
				parent._disposeChilren();
				parent._onLoad();
			}
		}
		return newTiles;
	}

	/**
	 * Load data
	 * @param loader data loader
	 * @returns Promise<void>
	 */
	public load(loader: ITileLoader, _minLevel: number, _maxLevel: number): Promise<void> {
		// if (this.loadState === "loaded" || this.coord.z < minLevel) {
		// if (this.loadState === "loaded") {
		// 	return Promise.resolve();
		// }
		// Reset the abortC controller
		this._abortController = new AbortController();
		this._loadState = "loading";

		// Load tile data
		return new Promise((resolve) => loader.load(this, () => resolve(this._onLoad())));
	}

	/**
	 * Recursion to find showing parent
	 * @returns showing parent or null
	 */
	private _getShowingParent(): this | null {
		const parent = this.parent;
		if (!parent || !parent.isTile) {
			return null;
		}
		if (parent.showing && !parent.isDefault) {
			return parent;
		}
		return parent._getShowingParent();
	}

	private _hasShowChildren() {
		let result = false;
		this.traverse((child) => {
			if (child.showing && child !== this && child.loadState === "loaded") {
				result = true;
			}
		});
		return result;
	}

	public _checkVisible(): boolean {
		const leafs: Tile[] = [];
		this.traverse((child) => leafs.push(child));
		// Check if all children has loaded
		const loaded = leafs.filter((child) => child.isLeaf).every((child) => child.loadState === "loaded");
		if (loaded) {
			// If all children has loaded, show leaf and hide the other
			leafs.forEach((child) => (child.showing = child.isLeaf));
		}
		return loaded;
	}

	/**
	 * Tile loaded callback
	 */
	private _onLoad() {
		if (!this.parent) {
			this.dispose(true);
			return;
		}

		this._loadState = "loaded";
		this._updateHeight();

		this.showing = false;

		// Hide if tile is not a leaf and it has showing child
		if (!this.isLeaf && this._hasShowChildren()) {
			return;
		}
		// If tile is a leaf, showing when all of brother to be loaded
		const loadedParent = this._getShowingParent();
		if (loadedParent) {
			loadedParent._checkVisible();
		} else {
			this.showing = true;
		}
	}

	// update height
	private _updateHeight() {
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
			this.abortLoad();
			this._dispose();
			this._loadState = "empty";
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

	private _disposeChilren() {
		this.children.forEach((child) => child.dispose(true));
		this.clear();
	}

	private _dispose() {
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
