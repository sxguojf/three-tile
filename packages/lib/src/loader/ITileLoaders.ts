/**
 * 瓦片加载器接口
 * @author: 郭江峰
 * @date: 2023-04-06
 */

import { BufferGeometry, Color, Material, Mesh } from "three";
import { ISource } from "../source";
import { TileLoadingManager } from "./TileLoadingManager";

/**
 * 瓦片坐标类型
 */
export type TileCoords = {
	/** 瓦片 X 坐标 */
	x: number;
	/** 瓦片 Y 坐标 */
	y: number;
	/** 瓦片 Z 坐标 */
	z: number;
};

/**
 * 瓦片加载参数类型，包括瓦片投影范围和经纬度范围
 */
export type TileLoadParamsType = TileCoords & {
	/** 瓦片投影范围（或剪裁范围） */
	bounds: [number, number, number, number];
	/** 瓦片经纬度范围 */
	lonLatBounds?: [number, number, number, number];
};

/**
 * 瓦片加载参数类型，包括数据源
 */
export type TileSourceLoadParamsType<TSource extends ISource = ISource> = TileLoadParamsType & {
	/** 瓦片数据源 */
	source: TSource;
};

interface TileBackgroundMaterial extends Material {
	color: Color;
}

/**
 * 瓦片加载器接口
 */
export interface ITileLoader {
	/** 正在进行的下载线程数量 */
	downloadingThreads: number;
	/** 调试级别 */
	debug: number;
	/** 瓦片加载管理器 */
	manager: TileLoadingManager;
	/** 影像数据加载器 */
	imgSource: ISource[];
	/** 地形数据加载器 */
	demSource: ISource | undefined;
	/** 地图背景材质 */
	backgroundMaterial: TileBackgroundMaterial;
	/** 经纬度范围 */
	bounds: [number, number, number, number];
	/** 加载瓦片数据 */
	load(params: TileCoords): Promise<Mesh>;
	/** 释放瓦片模型 */
	unload(tileMesh: Mesh): void;
	/**  更新瓦片数据 */
	update(tileMesh: Mesh, params: TileCoords, updateMaterial: boolean, updateGeometry: boolean): Promise<Mesh>;
}

/**
 * 加载器元数据类型
 */
export type ITileLoaderInfo = {
	/** 加载器版本号 */
	version: string;
	/** 加载器作者 */
	author?: string;
	/** 加载器说明 */
	description?: string;
};

/**
 * 瓦片材质加载器接口, 用于加载瓦片影像
 */
export interface ITileMaterialLoader<TMaterial extends Material = Material> {
	isMaterialLoader?: true;
	/** 加载器信息 */
	info: ITileLoaderInfo;
	/** 数据类型标记 */
	dataType: string;
	/**加载影像数据 */
	load(params: TileSourceLoadParamsType): Promise<TMaterial>;
	/** 卸载材质数据 */
	unload?(material: TMaterial): void;
}

/**
 * 瓦片几何体加载器接口, 用于加载瓦片地形
 */
export interface ITileGeometryLoader<TGeometry extends BufferGeometry = BufferGeometry> {
	isMaterialLoader?: false;
	/** 加载器信息 */
	info: ITileLoaderInfo;
	/** 数据类型标记 */
	dataType: string;
	/** 加载地形数据 */
	load(params: TileSourceLoadParamsType): Promise<TGeometry>;
	/** 卸载几何体数据 */
	unload?(geometry: TGeometry): void;
}
