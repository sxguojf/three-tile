/**
 *@description: Loader interface
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferGeometry, LoadingManager, Material } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";

/** Tile loader interface */
export interface ITileLoader {
	manager: LoadingManager;
	imgSource: ISource[];
	demSource: ISource | undefined;
	cacheSize: number;
	load(x: number, y: number, z: number, onLoad: () => void): Tile;
}

/**  Material loader interface */
export interface ITileMaterialLoader {
	dataType: string;
	load(source: ISource, x: number, y: number, z: number, onLoad: () => void, abortSignal: AbortSignal): Material;
}

/** geometry loader interface */
export interface ITileGeometryLoader {
	dataType: string;
	load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): BufferGeometry;
}

export interface IBoundsSource extends ISource {
	getTileBounds(x: number, y: number, z: number): [number, number, number, number];
}
