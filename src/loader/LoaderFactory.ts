/**
 *@description: Tile Loader factory
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { LoadingManager } from "three";
import { ISource } from "../source";
import { ITileGeometryLoader, ITileMaterialLoader } from "./ITileLoaders";
import { author, version } from "..";

console.log(`====================three-tile V${version}==============================`);

export class TileLoadingManager extends LoadingManager {
	public onParseEnd?: (url: string) => void = undefined;

	public parseEnd(url: string) {
		// setTimeout(() => this.onParseEnd && this.onParseEnd!(url));
		this.onParseEnd && this.onParseEnd!(url);
	}
}

/**
 * Factory for loader
 */
export const LoaderFactory = {
	manager: new TileLoadingManager(),
	// Dict of dem loader
	demLoaderMap: new Map<string, ITileGeometryLoader>(),
	// Dict of img loader
	imgLoaderMap: new Map<string, ITileMaterialLoader>(),

	/**
	 * Register material loader
	 * @param loader material loader
	 */
	registerMaterialLoader(loader: ITileMaterialLoader) {
		loader.author = loader.author ?? author.name;
		LoaderFactory.imgLoaderMap.set(loader.dataType, loader);
		console.log(`* Register imageLoader: '${loader.dataType}', Author: '${loader.author}'`);
	},

	/**
	 * Register geometry loader
	 * @param loader geometry loader
	 */
	registerGeometryLoader(loader: ITileGeometryLoader) {
		loader.author = loader.author ?? author.name;
		LoaderFactory.demLoaderMap.set(loader.dataType, loader);
		console.log(`* Register terrainLoader: '${loader.dataType}', Author: '${loader.author}'`);
	},

	/**
	 * Get material loader from datasource
	 * @param source datasource
	 * @returns material loader
	 */
	getMaterialLoader(source: ISource) {
		const loader = LoaderFactory.imgLoaderMap.get(source.dataType);
		if (loader) {
			return loader;
		} else {
			throw `Source dataType "${source.dataType}" is not support!`;
		}
	},

	/**
	 * Get geometry loader from datasource
	 * @param source datasouce
	 * @returns geometry loader
	 */
	getGeometryLoader(source: ISource) {
		const loader = LoaderFactory.demLoaderMap.get(source.dataType);
		if (loader) {
			return loader;
		} else {
			throw `Source dataType "${source.dataType}" is not support!`;
		}
	},

	getLoadersInfo() {
		const imgLoaders = Array.from(this.imgLoaderMap.values()).map((loader) => ({
			category: "image",
			loader,
		}));
		const demLoaders = Array.from(this.demLoaderMap.values()).map((loader) => ({
			category: "terrain",
			loader,
		}));
		return [...imgLoaders, ...demLoaders];
	},
};
