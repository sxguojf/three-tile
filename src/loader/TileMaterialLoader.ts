/**
 *@description: Image Material loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Material, Texture } from "three";
import { ITileMaterialLoader, LoadParamsType } from ".";
import { TileMaterial } from "../material";
import { ISource } from "../source";
import { getSafeTileUrlAndBounds } from "./util";
import { LoaderFactory } from "./LoaderFactory";

/**
 * Image loader base calss
 */
export abstract class TileMaterialLoader implements ITileMaterialLoader {
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
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (!url) {
			return material;
		}
		const texture = await this.doLoad(url, { x, y, z, clipBounds: clipBounds });
		material.setTexture(texture);
		LoaderFactory.manager.parseEnd(url);
		return material;
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @returns {Promise<TBuffer>} the buffer of download data
	 */
	protected abstract doLoad(url: string, params: LoadParamsType): Promise<Texture>;
}
