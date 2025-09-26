import { BufferGeometry, Material, Mesh } from "three";

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

export type TileMesh = Mesh<BufferGeometry, Material[]>;

/**
 * 瓦片加载器接口
 */
export interface ITileLoader {
	/** 正在进行的下载线程数量 */
	downloadingThreads: number;
	/** 最大线程数量 */
	maxThreads: number;
	/** 调试级别 */
	debug: number;
	/** 投影ID */
	projectionID: string;
	/** 加载瓦片数据 */
	load(coord: TileCoords): Promise<TileMesh>;
	/** 释放瓦片模型 */
	unload(tileMesh: Mesh<BufferGeometry, Material[]>): void;
	/** 更新瓦片 */
	modify(coord: TileCoords, tileMesh: TileMesh): Promise<void>;
}
