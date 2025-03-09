/**
 *@description: Geometry loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry } from "three";
import { ITileGeometryLoader, LoadParamsType } from ".";
import { TileGeometry } from "../geometry";
import { ISource } from "../source";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndBounds } from "./util";

/**
 * Terrain loader base calss
 */
export abstract class TileGeometryLoader implements ITileGeometryLoader {
	public dataType = "";
	public useWorker = true;

	/**
	 * load tile's data from source
	 * @param source
	 * @param tile
	 * @param onError
	 * @returns
	 */
	public async load(source: ISource, x: number, y: number, z: number): Promise<BufferGeometry> {
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (!url) {
			return new TileGeometry();
		}
		const geometry = await this.doLoad(url, { x, y, z, clipBounds: clipBounds });
		LoaderFactory.manager.parseEnd(url);
		return geometry;
	}

	/**
	 * Download terrain data
	 * @param url url
	 */
	protected abstract doLoad(url: string, params: LoadParamsType): Promise<BufferGeometry>;

	/**
	 * Parse the buffer data to geometry data
	 * @param buffer the data of download
	 * @param x tile x condition
	 * @param y tile y condition
	 * @param z tile z condition
	 * @param clipBounds the bounds of it parent
	 */
	// protected abstract doPrase(
	// 	buffer: TBuffer,
	// 	x: number,
	// 	y: number,
	// 	z: number,
	// 	clipBounds: [number, number, number, number],
	// ): Promise<GeometryDataType | Float32Array>;
}
