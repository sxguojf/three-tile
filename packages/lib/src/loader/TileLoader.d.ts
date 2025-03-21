/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { BufferGeometry, Material } from "three";
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
     * @param x x coordinate of tile
     * @param y y coordinate of tile
     * @param z z coordinate of tile
     * @returns Promise<MeshDateType> tile data
     */
    load(params: TileLoadParamsType): Promise<MeshDateType>;
    /**
     * Load geometry
     * @param x x coordinate of tile
     * @param y y coordinate of tile
     * @param z z coordinate of tile
     * @returns BufferGeometry
     */
    protected loadGeometry(x: number, y: number, z: number, tileBounds: [number, number, number, number]): Promise<BufferGeometry>;
    /**
     * Load material
     * @param x x coordinate of tile
     * @param y y coordinate of tile
     * @param z z coordinate of tile
     * @returns Material[]
     */
    protected loadMaterial(x: number, y: number, z: number, bounds: [number, number, number, number]): Promise<Material[]>;
    /**
     * Check the tile is in the source bounds
     * @returns true in the bounds,else false
     */
    private _isBoundsInSource;
}
