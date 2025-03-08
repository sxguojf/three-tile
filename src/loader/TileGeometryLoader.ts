/**
 *@description: Geometry loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry } from "three";
import { ITileGeometryLoader } from ".";
import { GeometryDataType, TileGeometry } from "../geometry";
import { ISource } from "../source";
import { getSafeTileUrlAndBounds } from "./util";
import { LoaderFactory } from "./LoaderFactory";

/**
 * Terrain loader base calss
 */
export abstract class TileGeometryLoader<TBuffer = any> implements ITileGeometryLoader {
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
		const { url, bounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (!url) {
			return new TileGeometry();
		}
		const data = await this.doLoad(url);
		LoaderFactory.manager.parseStart(url);
		const geometryData = await this.doPrase(data, x, y, z, bounds);
		const geometry = new TileGeometry();
		if (geometryData instanceof Float32Array) {
			geometry.setDEM(geometryData);
		} else {
			geometry.setData(geometryData);
		}
		LoaderFactory.manager.parseEnd(url);
		return geometry;
	}

	/**
	 * Download terrain data
	 * @param url url
	 */
	protected abstract doLoad(url: string): Promise<TBuffer>;

	/**
	 * Parse the buffer data to geometry data
	 * @param buffer the data of download
	 * @param x tile x condition
	 * @param y tile y condition
	 * @param z tile z condition
	 * @param clipBounds the bounds of it parent
	 */
	protected abstract doPrase(
		buffer: TBuffer,
		x: number,
		y: number,
		z: number,
		clipBounds: [number, number, number, number],
	): Promise<GeometryDataType | Float32Array>;
}
