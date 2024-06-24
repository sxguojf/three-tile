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
 */
export interface ITileLoader {
	manager: LoadingManager;
	imgSource: ISource[];
	demSource: ISource | undefined;
	cacheSize: number;
	load(
		tile: Tile,
		onLoad: () => void,
		onError: (err: any) => void,
	): {
		geometry: BufferGeometry;
		material: Material[];
	};
}

/**  Material loader interface */
export interface ITileMaterialLoader {
	dataType: string;
	load(source: ISource, tile: Tile, onLoad: () => void, onError: (err: any) => void): Material;
}

/** geometry loader interface */
export interface ITileGeometryLoader {
	dataType: string;
	load(source: ISource, tile: Tile, onLoad: () => void, onError: (err: any) => void): BufferGeometry;
}
