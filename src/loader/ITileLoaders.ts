/**
 * Tile Loader Interface
 * @author: 郭江峰
 * @date: 2023-04-06
 */

import { BufferGeometry, Material } from "three";
import { ISource } from "../source";
import { TileLoadingManager } from "./LoaderFactory";

/** Tile Mesh Data Type */
export type MeshDateType = {
	/** Tile materials */
	materials: Material[];
	/** Tile geometry */
	geometry: BufferGeometry;
};

/**
 * Tile Load Params Type
 */
export type TileLoadParamsType = {
	/** Tile X Coordinate */
	x: number;
	/** Tile Y Coordinate */
	y: number;
	/** Tile Z Coordinate */
	z: number;
	/** Tile Bounds */
	bounds: [number, number, number, number];
};

/**
 * Tile Source Load Params Type
 */
export type TileSourceLoadParamsType = TileLoadParamsType & {
	/** Tile Data Source */
	source: ISource;
};

/** Tile Loader Interface */
export interface ITileLoader<TMeshData extends MeshDateType = MeshDateType> {
	/** Load Tile Data */
	manager: TileLoadingManager;
	/** Image Loader */
	imgSource: ISource[];
	/** Terrain Loader */
	demSource: ISource | undefined;
	/** Use Worker? */
	useWorker: boolean;
	/** Load Tile Data */
	load(params: TileLoadParamsType): Promise<TMeshData>;
}

/** Tile Loader Info Interface */
export interface ITileLoaderInfo {
	/** Loader Version */
	version: string;
	/** Loader Author */
	author?: string;
	/** Loader Description */
	description?: string;
}

/** Material Loader Interface */
export interface ITileMaterialLoader<TMaterial extends Material = Material> {
	/** Loader Info */
	info: ITileLoaderInfo;
	/** Tile Data Type */
	dataType: string;
	/** Use Worker? */
	useWorker?: boolean;
	/** Load Image Data From Source */
	load(params: TileSourceLoadParamsType): Promise<TMaterial>;
}

/** Geometry Loader Interface */
export interface ITileGeometryLoader<TGeometry extends BufferGeometry = BufferGeometry> {
	/** Loader Info */
	info: ITileLoaderInfo;
	/** Tile Data Type */
	dataType: string;
	/** Use Worker? */
	useWorker?: boolean;
	/** Load Terrain Data From Source */
	load(params: TileSourceLoadParamsType): Promise<TGeometry>;
}
