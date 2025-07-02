/**
 *@description: Image Material loader abstract base class
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Texture } from "three";
import { ITileMaterialLoader, TileLoadClipParamsType, TileSourceLoadParamsType } from ".";
import { version } from "..";
import { ITileMaterial, TileMaterial } from "../material";
import { getSafeTileUrlAndBounds } from "./util";

/**
 * Image loader base calss
 */
export abstract class TileMaterialLoader implements ITileMaterialLoader<ITileMaterial> {
	public info = {
		version,
		description: "Image loader base class",
	};

	public dataType = "";
	private _material: ITileMaterial = new TileMaterial();
	/** 取得默认材质 */
	public get material() {
		return this._material;
	}
	/** 设置默认材质 */
	public set material(value) {
		this.material.dispose();
		this._material = value;
	}

	/**
	 * Load tile material from source
	 * @param source
	 * @param tile
	 * @returns
	 */
	public async load(params: TileSourceLoadParamsType): Promise<ITileMaterial> {
		const { source, x, y, z } = params;
		const material = this.createMaterial();
		// get max level tile and bounds
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (url) {
			const texture = await this.doLoad(url, { ...params, clipBounds });
			if (texture) {
				material.map = texture;
			} else {
				material.map = new Texture();
			}
		}
		return material;
	}

	/**
	 * Dispose material
	 * @param material material
	 */
	public unload(material: ITileMaterial): void {
		const texture = material.map;
		if (texture) {
			if (texture.image instanceof ImageBitmap) {
				texture.image.close();
			}
			texture.dispose();
		}
	}

	/**
	 * Create material
	 * @returns {ITileMaterial} the material of tile
	 */
	public createMaterial(): ITileMaterial {
		return this.material.clone();
	}

	/**
	 * Download terrain data
	 * @param url url
	 * @returns {Promise<TBuffer>} the buffer of download data
	 */
	protected async doLoad(_url: string, _params: TileLoadClipParamsType): Promise<Texture | undefined | null> {
		return Promise.resolve(undefined);
	}
}
