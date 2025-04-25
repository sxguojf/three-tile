/**
 *@description: Image Material loader abstract base class
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { ImageLoader, Material, SRGBColorSpace, Texture } from "three";
import {
	ITileMaterialLoader,
	LoaderFactory,
	TileSourceLoadParamsType,
	getSafeTileUrlAndBounds,
	getSubImage,
} from "three-tile";
import { TileFilterMaterial } from "./TileFilterMaterial";
// import { getSafeTileUrlAndBounds } from "./util";

interface ITileMaterial extends Material {
	map?: Texture | null;
}

/**
 * Image loader base calss
 */
export class TileFilterLoader implements ITileMaterialLoader<ITileMaterial> {
	public info = {
		version: "0.10.0",
		description: "Image filter loader base class",
	};

	public dataType = "image-filter";
	private loader = new ImageLoader(LoaderFactory.manager);

	/**
	 * Load tile data from source
	 * @param source
	 * @param tile
	 * @returns
	 */
	public async load(params: TileSourceLoadParamsType): Promise<ITileMaterial> {
		const { source, x, y, z } = params;
		const material = this.createMaterial(params);
		// get max level tile and bounds
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (url) {
			const texture = await this.doLoad(url, { source, x, y, z, bounds: clipBounds });
			material.map = texture;
		}
		return material;
	}

	/**
	 * Create material, override this method to create custom material
	 * @returns {ITileMaterial} the material of tile
	 */
	protected createMaterial(_params: TileSourceLoadParamsType): ITileMaterial {
		// return new TileMaterial();
		return new TileFilterMaterial();
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @returns {Promise<TBuffer>} the buffer of download data
	 */
	protected async doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture> {
		const img = await this.loader.loadAsync(url).catch(_err => {
			return new Image(1, 1);
		});
		const texture = new Texture();
		texture.colorSpace = SRGBColorSpace;
		const { bounds: clipBounds } = params;
		// 是否需要剪裁
		if (clipBounds[2] - clipBounds[0] < 1) {
			texture.image = getSubImage(img, clipBounds);
		} else {
			texture.image = img;
		}
		texture.needsUpdate = true;
		return texture;
	}
}
