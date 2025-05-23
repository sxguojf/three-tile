/**
 *@description: Image Material loader abstract base class
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Texture } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from ".";
import { ITileMaterial, TileMaterial } from "../material";
import { getSafeTileUrlAndBounds } from "./util";

export type MaterialCreator = (loaderParams: TileSourceLoadParamsType) => ITileMaterial;

/**
 * Image loader base calss
 */
export abstract class TileMaterialLoader implements ITileMaterialLoader<ITileMaterial> {
	public info = {
		version: "0.11.0",
		description: "Image loader base class",
	};

	public dataType = "";
	private _materialCreator: MaterialCreator = (_params: TileSourceLoadParamsType) => new TileMaterial();

	/**
	 * Load tile data from source
	 * @param source
	 * @param tile
	 * @returns
	 */
	public async load(params: TileSourceLoadParamsType): Promise<ITileMaterial> {
		const { source, x, y, z } = params;
		const material = this._materialCreator(params);
		// get max level tile and bounds
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (url) {
			const texture = await this.doLoad(url, { source, x, y, z, bounds: clipBounds });
			material.map = texture;
		}
		return material;
	}

	public unload(material: ITileMaterial): void {
		const texture = material.map;
		if (texture) {
			if (texture.image instanceof ImageBitmap) {
				texture.image.close();
			}
			texture.dispose();
		}
	}

	public setMaterialCreator(creator: MaterialCreator) {
		this._materialCreator = creator;
		return this;
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @returns {Promise<TBuffer>} the buffer of download data
	 */
	protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
}
