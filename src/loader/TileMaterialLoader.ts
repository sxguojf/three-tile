/**
 *@description: Image Material loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Material, Texture } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from ".";
import { TileMaterial } from "../material";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndBounds } from "./util";

/**
 * Image loader base calss
 */
export abstract class TileMaterialLoader implements ITileMaterialLoader {
	public info = {
		version: "0.10.0",
		description: "Image loader base class",
	};

	public dataType = "";
	public useWorker = true;

	/**
	 * Load tile data from source
	 * @param source
	 * @param tile
	 * @returns
	 */
	public async load(params: TileSourceLoadParamsType): Promise<Material> {
		const { source, x, y, z } = params;
		const material = new TileMaterial();
		// get max level tile and bounds
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (!url) {
			return material;
		}
		const texture = await this.doLoad(url, { source, x, y, z, bounds: clipBounds });
		material.setTexture(texture);
		LoaderFactory.manager.parseEnd(url);
		return material;
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @returns {Promise<TBuffer>} the buffer of download data
	 */
	protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
}
