/**
 * Tile Loader Interface
 * @author: 郭江峰
 * @date: 2023-04-06
 */

import { BufferGeometry, Material, Mesh } from "three";
import { ISource } from "../source";
import { TileLoadingManager } from "./LoaderFactory";

/**
 * 瓦片加载参数类型
 */
export type TileLoadParamsType = {
	/** Tile X Coordinate */
	x: number;
	/** Tile Y Coordinate */
	y: number;
	/** Tile Z Coordinate */
	z: number;
	/** Tile projection Bounds */
	bounds: [number, number, number, number];
	/** Tile lonlat Bounds */
	lonLatBounds?: [number, number, number, number];
};

/**
 * 瓦片加载参数+数据源类型
 */
export type TileSourceLoadParamsType<TSource extends ISource = ISource> = TileLoadParamsType & {
	/** Tile Data Source */
	source: TSource;
};

/**
 * 瓦片加载器接口
 */
export interface ITileLoader {
	/** Load Tile Data */
	manager: TileLoadingManager;
	/** Image Loader */
	imgSource: ISource[];
	/** Terrain Loader */
	demSource: ISource | undefined;
	/** Load Tile Data */
	load(params: TileLoadParamsType): Promise<Mesh>;
	/** Unload Tile Data */
	unload(tileMesh: Mesh): void;
}

/**
 * 加载器信息接口
 */
export interface ITileLoaderInfo {
	/** Loader Version */
	version: string;
	/** Loader Author */
	author?: string;
	/** Loader Description */
	description?: string;
}

/**
 * 瓦片材质加载器接口,用于加载瓦片影像
 */
export interface ITileMaterialLoader<TMaterial extends Material = Material> {
	isMaterialLoader?: true;
	/** Loader Info */
	info: ITileLoaderInfo;
	/** Tile Data Type */
	dataType: string;
	/** Load Image Data From Source */
	load(params: TileSourceLoadParamsType): Promise<TMaterial>;
	/** Unload material Data */
	unload?(material: TMaterial): void;
}

/**
 * 瓦片几何体加载器接口,用于加载瓦片地形
 */
export interface ITileGeometryLoader<TGeometry extends BufferGeometry = BufferGeometry> {
	isMaterialLoader?: false;
	/** Loader Info */
	info: ITileLoaderInfo;
	/** Tile Data Type */
	dataType: string;
	/** Load Terrain Data From Source */
	load(params: TileSourceLoadParamsType): Promise<TGeometry>;
	/** Unload geometry Data */
	unload?(geometry: TGeometry): void;
}
