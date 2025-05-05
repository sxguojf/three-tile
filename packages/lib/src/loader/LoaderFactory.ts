/**
 *@description: Tile Loader factory
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { LoadingManager, BufferGeometry } from "three";
import { ISource } from "../source";
import { ITileGeometryLoader, ITileMaterialLoader } from "./ITileLoaders";
import { author, version } from "../../package.json";

console.log(`====================three-tile V${version}==============================`);

export class TileLoadingManager extends LoadingManager {
	public onParseEnd?: (geometry: BufferGeometry) => void = undefined;

	public parseEnd(geometry: BufferGeometry) {
		this.onParseEnd && this.onParseEnd(geometry);
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
		LoaderFactory.imgLoaderMap.set(loader.dataType, loader);
		loader.info.author = loader.info.author ?? author.name;
		console.log(`* Register imageLoader: '${loader.dataType}', Author: '${loader.info.author}'`);
	},

	/**
	 * Register geometry loader
	 * @param loader geometry loader
	 */
	registerGeometryLoader(loader: ITileGeometryLoader) {
		LoaderFactory.demLoaderMap.set(loader.dataType, loader);
		loader.info.author = loader.info.author ?? author.name;
		console.log(`* Register terrainLoader: '${loader.dataType}', Author: '${loader.info.author}'`);
	},

	/**
	 * Get material loader from datasource
	 * @param source datasource
	 * @returns material loader
	 */
	getMaterialLoader(source: ISource | string) {
		const dataType = typeof source === "string" ? source : source.dataType;
		const loader = LoaderFactory.imgLoaderMap.get(dataType);
		if (loader) {
			return loader;
		} else {
			throw `Source dataType "${dataType}" is not support!`;
		}
	},

	/**
	 * Get geometry loader from datasource
	 * @param source datasouce
	 * @returns geometry loader
	 */
	getGeometryLoader(source: ISource | string) {
		const dataType = typeof source === "string" ? source : source.dataType;
		const loader = LoaderFactory.demLoaderMap.get(dataType);
		if (loader) {
			return loader;
		} else {
			throw `Source dataType "${dataType}" is not support!`;
		}
	},
};
