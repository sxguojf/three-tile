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
} from "three";

/**
 * Tile event map
 */
export interface TTileEventMap extends Object3DEventMap {
	dispose: BaseEvent;
	ready: BaseEvent;
	show: BaseEvent & { show: boolean };
	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };
}

// Default geometry of tile
const defaultGeometry = new InstancedBufferGeometry();

/**
 * Class Tile, inherit of Mesh
 */
export class Tile extends Mesh<BufferGeometry, Material[], TTileEventMap> {
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

	/** Index of tile, mean positon in parent.  (0:left-bottom, 1:right-bottom,2:left-top、3:right-top、-1:parent is null）	 */
	public get index(): number {
		return this.parent ? this.parent.children.indexOf(this) : -1;
	}

	/** Get load state */
	public get loaded() {
		return this.material.length > 0;
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
		if (this.isLeaf && this.isTile) {
			super.raycast(raycaster, intersects);
		}
	}

	/** Called when tile loaded  */
	public onLoaded() {
		// Update Z
		this._heightUpdate();
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
	 * Free the tile resources
	 * @param disposeSelf dispose self?
	 */
	public dispose(disposeSelf: boolean) {
		if (disposeSelf && this.isTile) {
			// Fire dispose event, Loader listen and execute
			this.dispatchEvent({ type: "dispose" });
		}

		// remove all children recursionly
		this.children.forEach((child) => child.dispose(true));
		this.clear();

		return this;
	}
}
