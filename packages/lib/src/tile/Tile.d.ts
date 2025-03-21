/**
 *@description: LOD Tile mesh
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { BaseEvent, BufferGeometry, Camera, Intersection, Material, Mesh, Object3DEventMap, Raycaster } from "three";
import { ITileLoader } from "../loader";
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
    "tile-created": BaseEvent & {
        tile: Tile;
    };
    "tile-loaded": BaseEvent & {
        tile: Tile;
    };
}
/**
 * Class Tile, inherit of Mesh
 */
/**
 * Represents a tile in a 3D scene.
 * Extends the Mesh class with BufferGeometry and Material.
 */
export declare class Tile extends Mesh<BufferGeometry, Material[], TTileEventMap> {
    private static _downloadThreads;
    /**
     * Number of download threads.
     */
    static get downloadThreads(): number;
    /** Coordinate of tile */
    readonly x: number;
    readonly y: number;
    readonly z: number;
    /** Is a tile? */
    readonly isTile = true;
    /** Tile parent */
    readonly parent: this | null;
    /** Children of tile */
    readonly children: this[];
    private _showing;
    /**
     * Gets the showing state of the tile.
     */
    get showing(): boolean;
    /**
     * Sets the showing state of the tile.
     * @param value - The new showing state.
     */
    set showing(value: boolean);
    private _ready;
    /** Max height of tile */
    private _maxZ;
    /**
     * Gets the maximum height of the tile.
     */
    get maxZ(): number;
    /**
     * Sets the maximum height of the tile.
     * @param value - The new maximum height.
     */
    protected set maxZ(value: number);
    /** Distance to camera */
    distToCamera: number;
    sizeInWorld: number;
    /**
     * Gets the index of the tile in its parent's children array.
     * @returns The index of the tile.
     */
    get index(): number;
    private _loaded;
    /**
     * Gets the load state of the tile.
     */
    get loaded(): boolean;
    private _inFrustum;
    /** Is tile in frustum ?*/
    get inFrustum(): boolean;
    /**
     * Sets whether the tile is in the frustum.
     * @param value - The new frustum state.
     */
    protected set inFrustum(value: boolean);
    /** Tile is a leaf ?  */
    get isLeaf(): boolean;
    /**
     * Constructor for the Tile class.
     * @param x - Tile X-coordinate, default: 0.
     * @param y - Tile Y-coordinate, default: 0.
     * @param z - Tile level, default: 0.
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     * Override Object3D.traverse, change the callback param type to "this".
     * @param callback - The callback function.
     */
    traverse(callback: (object: this) => void): void;
    /**
     * Override Object3D.traverseVisible, change the callback param type to "this".
     * @param callback - The callback function.
     */
    traverseVisible(callback: (object: this) => void): void;
    /**
     * Override Object3D.raycast, only test the tile has loaded.
     * @param raycaster - The raycaster.
     * @param intersects - The array of intersections.
     */
    raycast(raycaster: Raycaster, intersects: Intersection[]): void;
    /**
     * LOD (Level of Detail).
     * @param loader - The tile loader.
     * @param minLevel - The minimum level.
     * @param maxLevel - The maximum level.
     * @param threshold - The threshold.
     * @param onCreate - The callback function when a tile is created.
     * @param onLoad - The callback function when a tile is loaded.
     * @returns The current tile.
     */
    protected LOD(loader: ITileLoader, minLevel: number, maxLevel: number, threshold: number, onCreate: (tile: Tile) => void, onLoad: (tile: Tile) => void): this;
    /**
     * Asynchronously load tile data
     *
     * @param loader Tile loader
     */
    private _load;
    /**
     * Updates the tile.
     * @param params - The update parameters.
     * @returns The current tile.
     */
    update(params: TileUpdateParames): this;
    /**
     * Checks if the tile is ready to render.
     * @param minLevel - The minimum level.
     * @returns The current tile.
     */
    private _checkReady;
    /** Called when tile loaded  */
    private _onLoad;
    /**
     * Checks the visibility of the tile.
     */
    private _checkVisible;
    /**
     * Callback function triggered when a tile is created.
     * @param newTile - The newly created tile object.
     */
    private _onTileCreate;
    /**
     * Callback function triggered when a tile is loaded completely.
     * @param newTile - The loaded tile object.
     */
    private _onTileLoad;
    /**
     * Reloads the tile data.
     * @returns The current tile.
     */
    reload(): this;
    /**
     * Frees the tile resources.
     * @param disposeSelf - Whether to dispose the tile itself.
     * @returns The current tile.
     */
    dispose(disposeSelf: boolean): this;
}
