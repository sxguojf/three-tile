/**
 *@description: Loader factory
 *@author: Guojf
 *@date: 2023-04-06
 */

import { LoadingManager } from "three";
import { ISource } from "../source";
import { ITileGeometryLoader, ITileMaterialLoader } from "./ITileLoaders";

/**
 * factory for loader
 */
export const LoaderFactory = {
	manager: new LoadingManager(),
	// dict of dem loader
	demLoaderMap: new Map<string, ITileGeometryLoader>(),
	// dict of img loader
	imgLoaderMap: new Map<string, ITileMaterialLoader>(),

	/**
	 * register material loader
	 * @param loader material loader
	 */
	registerMaterialLoader(loader: ITileMaterialLoader) {
		LoaderFactory.imgLoaderMap.set(loader.dataType, loader);
		console.log(`* Register imageLoader: ${loader.dataType}`);
	},

	/**
	 * register geometry loader
	 * @param loader geometry loader
	 */
	registerGeometryLoader(loader: ITileGeometryLoader) {
		LoaderFactory.demLoaderMap.set(loader.dataType, loader);
		console.log(`* Register terrainLoader: ${loader.dataType}`);
	},

	/**
	 * get material loader from datasource
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
	 * get geometry loader from datasource
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
};
