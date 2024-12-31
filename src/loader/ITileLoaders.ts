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
	loadChildren(px: number, py: number, pz: number, minLevel: number, onLoad: (tile: Tile) => void): Tile[];
}

/**  Material loader interface */
export interface ITileMaterialLoader {
	dataType: string;
	load(source: ISource, tile: Tile, onLoad: () => void, abortSignal: AbortSignal): Material;
}

/** geometry loader interface */
export interface ITileGeometryLoader {
	dataType: string;
	load(source: ISource, tile: Tile, onLoad: () => void, abortSignal: AbortSignal): BufferGeometry;
}
