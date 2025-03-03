/**
 *@description: Tile loader interface
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry, Material } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";
import { TileLoadingManager } from "./LoaderFactory";

/** Tile loader interface */
export interface ITileLoader {
	/** @description: load tile data */
	manager: TileLoadingManager;
	/** @description: image loader */
	imgSource: ISource[];
	/** @description: terrain loader */
	demSource: ISource | undefined;
	/** @description: data cache size */
	cacheSize: number;
	/** @description: use worker? */
	useWorker: boolean;
	/** @description: load tile data */
	load(x: number, y: number, z: number, onLoad: () => void): Tile;
}
/** Tile loader info interface */
export interface ITileLoaderInfo {
	/** @description: tile data type */
	dataType: string;
	/** @description: use workere */
	useWorker?: boolean;
	/** @description: loader author */
	author?: string;
	/** @description: loader discription */
	discription?: string;
}

/**  Material loader interface */
export interface ITileMaterialLoader extends ITileLoaderInfo {
	/**
	 * @description: load tile material data
	 * @param source source data info
	 * @param x tile x condition
	 * @param y tile x condition
	 * @param z tile x condition
	 * @param onLoad load callback function
	 * @param abortSignal abort signal
	 * @returns {Material} tile Material
	 */
	load(source: ISource, x: number, y: number, z: number, onLoad: () => void, abortSignal: AbortSignal): Material;
}

/** geometry loader interface */
export interface ITileGeometryLoader extends ITileLoaderInfo {
	/**
	 * @description: load tile geometry data
	 * @param source source data info
	 * @param x tile x condition
	 * @param y tile x condition
	 * @param z tile x condition
	 * @param onLoad load callback function
	 * @param abortSignal abort signal
	 * @returns {BufferGeometry} tile Geometry
	 */
	load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): BufferGeometry;
}
