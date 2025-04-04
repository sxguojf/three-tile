/**
 *@description: Tile Loader factory
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { LoadingManager } from "three";
import { author, version } from "../../package.json";
console.log(`====================three-tile V${version}==============================`);
export class TileLoadingManager extends LoadingManager {
    onParseEnd = undefined;
    parseEnd(url) {
        // setTimeout(() => this.onParseEnd && this.onParseEnd!(url));
        this.onParseEnd && this.onParseEnd(url);
    }
}
/**
 * Factory for loader
 */
export const LoaderFactory = {
    manager: new TileLoadingManager(),
    // Dict of dem loader
    demLoaderMap: new Map(),
    // Dict of img loader
    imgLoaderMap: new Map(),
    /**
     * Register material loader
     * @param loader material loader
     */
    registerMaterialLoader(loader) {
        LoaderFactory.imgLoaderMap.set(loader.dataType, loader);
        loader.info.author = loader.info.author ?? author.name;
        console.log(`* Register imageLoader: '${loader.dataType}', Author: '${loader.info.author}'`);
    },
    /**
     * Register geometry loader
     * @param loader geometry loader
     */
    registerGeometryLoader(loader) {
        LoaderFactory.demLoaderMap.set(loader.dataType, loader);
        loader.info.author = loader.info.author ?? author.name;
        console.log(`* Register terrainLoader: '${loader.dataType}', Author: '${loader.info.author}'`);
    },
    /**
     * Get material loader from datasource
     * @param source datasource
     * @returns material loader
     */
    getMaterialLoader(source) {
        const loader = LoaderFactory.imgLoaderMap.get(source.dataType);
        if (loader) {
            return loader;
        }
        else {
            throw `Source dataType "${source.dataType}" is not support!`;
        }
    },
    /**
     * Get geometry loader from datasource
     * @param source datasouce
     * @returns geometry loader
     */
    getGeometryLoader(source) {
        const loader = LoaderFactory.demLoaderMap.get(source.dataType);
        if (loader) {
            return loader;
        }
        else {
            throw `Source dataType "${source.dataType}" is not support!`;
        }
    },
    // getLoadersInfo() {
    // 	const imgLoaders = Array.from(this.imgLoaderMap.values()).map((loader) => ({
    // 		category: "image",
    // 		dataType: loader.dataType,
    // 		info: loader.info,
    // 	}));
    // 	const demLoaders = Array.from(this.demLoaderMap.values()).map((loader) => ({
    // 		category: "terrain",
    // 		dataType: loader.dataType,
    // 		info: loader.info,
    // 	}));
    // 	return [...imgLoaders, ...demLoaders];
    // },
};
