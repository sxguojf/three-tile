/**
 *@description: Image Material loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Material, Texture } from "three";
import { ITileMaterialLoader } from ".";
import { TileMaterial } from "../material";
import { ISource } from "../source";
import { getSafeTileUrlAndBounds } from "./util";
import { LoaderFactory } from "./LoaderFactory";

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
			// download tile data
			this.doLoad(url, abortSignal)
				.then((data) => {
					LoaderFactory.manager.parseStart(url);
					// parse tile data
					this.doPrase(data, x, y, z, bounds)
						.then((texture) => {
							material.setTexture(texture);
							onLoad();
							LoaderFactory.manager.parseEnd(url);
						})
						.catch((err) => {
							console.error("Parse tile data error:", err);
						});
				})
				.catch(onLoad); // Download error, renturn default material
		} else {
			onLoad(); // No url, renturn default material
		}
		return material;
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @param abortSignal donwnload abort signal
	 * @returns {Promise<TBuffer>} the buffer of download data
	 */
	protected abstract doLoad(url: string, abortSignal: AbortSignal): Promise<TBuffer>;

	/**
	 * Parse the buffer data to geometry data
	 * @param buffer the data of download
	 * @param x tile x condition
	 * @param y tile y condition
	 * @param z tile z condition
	 * @param clipBounds the bounds of it parent
	 * @returns {Promise<Texture>} the texture of tile
	 */
	protected abstract doPrase(
		buffer: TBuffer,
		x: number,
		y: number,
		z: number,
		clipBounds: [number, number, number, number],
	): Promise<Texture>;
}
