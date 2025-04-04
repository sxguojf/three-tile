/**
 *@description: LOD Tile mesh
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { BaseEvent, BufferGeometry, Camera, Intersection, Material, Mesh, Object3DEventMap, Raycaster } from "three";
import { ITileLoader } from "../loader";
import { LODAction } from "./util";
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
    "tile-created": BaseEvent & {
        tile: Tile;
    };
    "tile-loaded": BaseEvent & {
        tile: Tile;
    };
    "tile-unload": BaseEvent & {
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
    private _ready;
    /** return this.minLevel < map.minLevel, True mean do not needs load tile data */
    private _isDummy;
    get isDummy(): boolean;
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
     * @returns this
     */
    protected LOD(params: TileUpdateParames): {
        action: LODAction;
        newTiles?: undefined;
    } | {
        action: LODAction;
        newTiles: Tile[];
    };
    /**
     * Checks the visibility of the tile.
     */
    /**
     * Checks the visibility of the tile.
     */
    private _checkVisible;
    /**
     * Asynchronously load tile data
     *
     * @param loader Tile loader
     * @returns this
     */
    private _load;
    /** New tile init */
    private _init;
    /**
     * Updates the tile.
     * @param params - The update parameters.
     * @returns this
     */
    update(params: TileUpdateParames): this;
    private _doAction;
    /**
     * Reloads the tile data.
     * @returns this
     */
    reload(loader: ITileLoader): this;
    /**
     * Checks if the tile is ready to render.
     * @returns this
     */
    private _checkReady;
    /**
     * UnLoads the tile data.
     * @param unLoadSelf - Whether to unload tile itself.
     * @returns this.
     */
    private _unLoad;
}
