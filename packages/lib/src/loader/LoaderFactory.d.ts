/**
 *@description: Tile Loader factory
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { LoadingManager } from "three";
import { ISource } from "../source";
import { ITileGeometryLoader, ITileMaterialLoader } from "./ITileLoaders";
export declare class TileLoadingManager extends LoadingManager {
    onParseEnd?: (url: string) => void;
    parseEnd(url: string): void;
}
/**
 * Factory for loader
 */
export declare const LoaderFactory: {
    manager: TileLoadingManager;
    demLoaderMap: Map<string, ITileGeometryLoader<import("three").BufferGeometry<import("three").NormalBufferAttributes>>>;
    imgLoaderMap: Map<string, ITileMaterialLoader<import("three").Material>>;
    /**
     * Register material loader
     * @param loader material loader
     */
    registerMaterialLoader(loader: ITileMaterialLoader): void;
    /**
     * Register geometry loader
     * @param loader geometry loader
     */
    registerGeometryLoader(loader: ITileGeometryLoader): void;
    /**
     * Get material loader from datasource
     * @param source datasource
     * @returns material loader
     */
    getMaterialLoader(source: ISource): ITileMaterialLoader<import("three").Material>;
    /**
     * Get geometry loader from datasource
     * @param source datasouce
     * @returns geometry loader
     */
    getGeometryLoader(source: ISource): ITileGeometryLoader<import("three").BufferGeometry<import("three").NormalBufferAttributes>>;
    getLoadersInfo(): {
        category: string;
        dataType: string;
        info: import("./ITileLoaders").ITileLoaderInfo;
    }[];
};
