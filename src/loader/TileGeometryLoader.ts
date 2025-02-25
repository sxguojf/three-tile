/**
 *@description: Geometry loader baseclass
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferGeometry } from "three";
import { ITileGeometryLoader } from ".";
import { GeometryDataType, TileGeometry } from "../geometry";
import { ISource } from "../source";
import { getSafeTileUrlAndBounds } from "./util";

/**
 * Terrain loader basecalss
 */
export abstract class TileGeometryLoader<TBuffer = any> implements ITileGeometryLoader {
	public dataType = "";
	public useWorker = true;

	/**
	 * load tile's data from source
	 * @param source
	 * @param tile
	 * @param onLoad
	 * @param onError
	 * @returns
	 */
	public load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): BufferGeometry {
		const geometry = new TileGeometry();
		// get max level tile and bounds
		const { url, bounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (url) {
			this.doLoad(
				url,
				(data) => {
					if (data) {
						this.doPrase(data, x, y, z, bounds, (geometryData) => {
							if (geometryData instanceof Float32Array) {
								geometry.setDEM(geometryData);
							} else {
								geometry.setData(geometryData);
							}
							onLoad();
						});
					}
				},
				onLoad,
				abortSignal,
			);
		} else {
			onLoad();
		}
		return geometry;
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @param onLoad callback on loaded
	 * @param onError callback on error
	 * @param abortSignal donwnload abort signal
	 */
	protected abstract doLoad(
		url: string,
		onLoad: (buffer: TBuffer) => void,
		onError: (event: ErrorEvent | Event | DOMException) => void,
		abortSignal: AbortSignal,
	): void;

	/**
	 * Parse the buffer data to geometry data
	 * @param buffer the data of download
	 * @param x tile x condition
	 * @param y tile y condition
	 * @param z tile z condition
	 * @param clipBounds the bounds of it parent
	 * @param onParse callback when parsed
	 */
	protected abstract doPrase(
		buffer: TBuffer,
		x: number,
		y: number,
		z: number,
		clipBounds: [number, number, number, number],
		onParse: (GeometryData: GeometryDataType | Float32Array, dem?: Uint8Array) => void,
	): void;
}
