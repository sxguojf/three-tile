/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { BufferGeometry, Material, Mesh } from "three";
import { ISource } from "../source";
import { ITileLoader, MeshDateType, TileLoadParamsType } from "./ITileLoaders";
/**
 * Tile loader
 */
export declare class TileLoader implements ITileLoader {
    private _imgSource;
    /** Get image source */
    get imgSource(): ISource[];
    /** Set image source */
    set imgSource(value: ISource[]);
    private _demSource;
    /** Get DEM source */
    get demSource(): ISource | undefined;
    /** Set DEM source */
    set demSource(value: ISource | undefined);
    private _useWorker;
    /** Get use worker */
    get useWorker(): boolean;
    /** Set use worker */
    set useWorker(value: boolean);
    /** Loader manager */
    manager: import("./LoaderFactory").TileLoadingManager;
    /**
     * Load getmetry and materail of tile from x, y and z coordinate.
     *
     * @returns Promise<MeshDateType> tile data
     */
    load(params: TileLoadParamsType): Promise<MeshDateType>;
    /**
     * Unload tile mesh data
     * @param tileMesh tile mesh
     */
    unload(tileMesh: Mesh): void;
    /**
     * Load geometry
     * @returns BufferGeometry
     */
    protected loadGeometry(params: TileLoadParamsType): Promise<BufferGeometry>;
    /**
     * Load material
     * @param x x coordinate of tile
     * @param y y coordinate of tile
     * @param z z coordinate of tile
     * @returns Material[]
     */
    protected loadMaterial(params: TileLoadParamsType): Promise<Material[]>;
    /**
     * Check the tile is in the source bounds. (projection coordinate)
     * @returns true in the bounds,else false
     */
    private _isBoundsInSourceBounds;
}
