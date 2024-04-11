/**
 *@description: loader factory
 *@author: Guojf
 *@date: 2023-04-06
 */

import { LoadingManager } from "three";
import { ISource } from "../source";
import { ITileGeometryLoader, ITileMaterialLoader } from "./ITileLoaders";

/**
 * factory for loader
 */
export class LoaderFactory {
	public static manager = new LoadingManager();
	// dict of dem loader
	private static demLoaderMap = new Map<string, ITileGeometryLoader>();
	// dict of img loader
	private static imgLoaderMap = new Map<string, ITileMaterialLoader>();

	/**
	 * register material loader
	 * @param loader material loader
	 */
	public static registerMaterialLoader(loader: ITileMaterialLoader) {
		LoaderFactory.imgLoaderMap.set(loader.dataType, loader);
		console.log(`* Register imageLoader: ${loader.dataType}`);
	}

	/**
	 * register geometry loader
	 * @param loader geometry loader
	 */
	public static registerGeometryLoader(loader: ITileGeometryLoader) {
		LoaderFactory.demLoaderMap.set(loader.dataType, loader);
		console.log(`* Register terrainLoader: ${loader.dataType}`);
	}

	/**
	 * get material loader from datasource
	 * @param source datasource
	 * @returns material loader
	 */
	public static getMaterialLoader(source: ISource) {
		const loader = LoaderFactory.imgLoaderMap.get(source.dataType);
		if (loader) {
			return loader;
		} else {
			throw `Source dataType "${source.dataType}" is not support!`;
		}
	}

	/**
	 * get geometry loader from datasource
	 * @param source datasouce
	 * @returns geometry loader
	 */
	public static getGeometryLoader(source: ISource) {
		const loader = LoaderFactory.demLoaderMap.get(source.dataType);
		if (loader) {
			return loader;
		} else {
			throw `Source dataType "${source.dataType}" is not support!`;
		}
	}
}
