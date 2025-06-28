import { Mesh } from "three";

/**
 * 瓦片坐标类型
 */
type TileCoords = {
	/** 瓦片 X 坐标 */
	x: number;
	/** 瓦片 Y 坐标 */
	y: number;
	/** 瓦片 Z 坐标 */
	z: number;
};

/**
 * 瓦片加载器接口
 */
export interface ITileLoader {
	/** 正在进行的下载线程数量 */
	downloadingThreads: number;
	/** 调试级别 */
	debug: number;
	/** 投影ID */
	projectionID: string;
	/** 加载瓦片数据 */
	load(params: TileCoords): Promise<Mesh>;
	/** 释放瓦片模型 */
	unload(tileMesh: Mesh): void;
	/**  更新瓦片数据 */
	update(tileMesh: Mesh, params: TileCoords, updateMaterial: boolean, updateGeometry: boolean): Promise<Mesh>;
}
