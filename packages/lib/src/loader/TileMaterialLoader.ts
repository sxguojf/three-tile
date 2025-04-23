/**
 *@description: Image Material loader abstract base class
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Material, Texture } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from ".";
import { TileMaterial } from "../material";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndBounds } from "./util";

interface ITileMaterial extends Material {
	map?: Texture | null;
}

/**
 * Image loader base calss
 */
export abstract class TileMaterialLoader implements ITileMaterialLoader<ITileMaterial> {
	public info = {
		version: "0.10.0",
		description: "Image loader base class",
	};

	public dataType = "";
	public _materialCreator?: () => Material;

	public constructor(options?: { materialCreator?: () => Material }) {
		this._materialCreator = options?.materialCreator;
	}

	/**
	 * Load tile data from source
	 * @param source
	 * @param tile
	 * @returns
	 */
	public async load(params: TileSourceLoadParamsType): Promise<Material> {
		const { source, x, y, z } = params;
		const material = (this._materialCreator && this._materialCreator()) || this.createMaterial();
		// get max level tile and bounds
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (url) {
			const texture = await this.doLoad(url, { source, x, y, z, bounds: clipBounds });
			if ("map" in material) {
				material.map = texture;
				LoaderFactory.manager.parseEnd(url);
			} else {
				throw new Error("Material must have map property");
			}
		}
		return material;
	}

	/**
	 * Create material, override this method to create custom material
	 * @returns {ITileMaterial} the material of tile data
	 */
	protected createMaterial(): ITileMaterial {
		return new TileMaterial();
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @returns {Promise<TBuffer>} the buffer of download data
	 */
	protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
}
