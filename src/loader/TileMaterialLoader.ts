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
	 * @returns
	 */
	public async load(source: ISource, x: number, y: number, z: number): Promise<Material> {
		const material = new TileMaterial();
		// get max level tile and bounds
		const { url, bounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (!url) {
			return material;
		}
		// download tile data
		const data = await this.doLoad(url);
		LoaderFactory.manager.parseStart(url);
		// parse tile data to geometry
		const texture = await this.doPrase(data, x, y, z, bounds);
		// set texture to material
		material.setTexture(texture);
		LoaderFactory.manager.parseEnd(url);
		return material;
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @returns {Promise<TBuffer>} the buffer of download data
	 */
	protected abstract doLoad(url: string): Promise<TBuffer>;

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
