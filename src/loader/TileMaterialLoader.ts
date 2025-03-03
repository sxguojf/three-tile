/**
 *@description: Image Material loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Material, Texture } from "three";
import { ITileMaterialLoader, LoaderFactory } from ".";
import { TileMaterial } from "../material";
import { ISource } from "../source";
import { getSafeTileUrlAndBounds } from "./util";

/**
 * Image loader base calss
 */
export abstract class TileMaterialLoader<TBuffer = any> implements ITileMaterialLoader {
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
	): Material {
		const material = new TileMaterial();
		// get max level tile and bounds
		const { url, bounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (url) {
			this.doLoad(
				url,
				(data) => {
					if (data) {
						LoaderFactory.manager.parseStart(url);
						this.doPrase(data, x, y, z, bounds, (texture) => {
							material.setTexture(texture);
							LoaderFactory.manager.parseEnd(url);
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
		return material;
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
		onParse: (texture: Texture) => void,
	): void;
}
