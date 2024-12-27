/**
 *@description: Loader interface
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferGeometry, LoadingManager, Material } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";

/**
 * Tile loader interface
 * todo: 按照谁创建谁销毁的原则，Loder应该增加dispose方法，用于销毁自己创建的瓦片资源，
 * 另外增加一个show方法，用于显示隐藏瓦片，Loader创建的瓦片，按理只有它知道如何显示隐藏。
 */
export interface ITileLoader {
	manager: LoadingManager;
	imgSource: ISource[];
	demSource: ISource | undefined;
	cacheSize: number;
	load(tile: Tile, onLoad: () => void): void;
}

/**  Material loader interface */
export interface ITileMaterialLoader {
	dataType: string;
	load(source: ISource, tile: Tile, onLoad: () => void): Material;
}

/** geometry loader interface */
export interface ITileGeometryLoader {
	dataType: string;
	load(source: ISource, tile: Tile, onLoad: () => void): BufferGeometry;
}
