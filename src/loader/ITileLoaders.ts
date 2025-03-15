/**
 *@description: Tile loader interface
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry, Material } from "three";
import { ISource } from "../source";
import { TileLoadingManager } from "./LoaderFactory";

/** Tile mesh data type */
export type MeshDateType = {
	materials: Material[];
	geometry: BufferGeometry;
};

/**
 * @description: tile load params type
 */
export type TileLoadParamsType = {
	/** Tile x coordinate */
	x: number;
	/** Tile y coordinate */
	y: number;
	/** Tile z coordinate */
	z: number;
	/** Tile bounds */
	bounds: [number, number, number, number];
};

/**
 * @description: tile load params type
 */
export type TileSourceLoadParamsType = TileLoadParamsType & {
	/** Tile data source  */
	source: ISource;
};

/** Tile loader interface */
export interface ITileLoader {
	/** @description: load tile data */
	manager: TileLoadingManager;
	/** @description: image loader */
	imgSource: ISource[];
	/** @description: terrain loader */
	demSource: ISource | undefined;
	/** @description: data cache size */
	// cacheSize: number;
	/** @description: use worker? */
	useWorker: boolean;
	/** @description: load tile data */
	load(params: TileLoadParamsType): Promise<MeshDateType>;
}

/** Tile loader info interface */
export interface ITileLoaderInfo {
	/** @description: loader author */
	author?: string;
	/** @description: loader description */
	description?: string;
}

/**  Material loader interface */
export interface ITileMaterialLoader {
	info: ITileLoaderInfo;
	/** @description: tile data type */
	dataType: string;
	/** @description: use workere */
	useWorker?: boolean;
	/** Load image data from source */
	load(params: TileSourceLoadParamsType): Promise<Material>;
}

/** geometry loader interface */
export interface ITileGeometryLoader {
	info: ITileLoaderInfo;
	/** tile data type */
	dataType: string;
	/** use workere */
	useWorker?: boolean;
	/** Load terrain data from source */
	load(params: TileSourceLoadParamsType): Promise<BufferGeometry>;
}
