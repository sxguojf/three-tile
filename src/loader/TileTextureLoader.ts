/**
 *@description: texture loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, Texture, SRGBColorSpace, DataTexture, RGBAFormat } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";
import { ImageLoaderEx } from "./ImageLoaerEx";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndBounds, rect2ImageBounds } from "./util";

const emptyTexture = new DataTexture(new Uint8Array([0,0,0,0]), 1, 1, RGBAFormat);;
/**
 * texture loader
 */
export class TileTextureLoader {
	// image loader
	private loader = new ImageLoaderEx(LoaderFactory.manager);
	/**
	 * load the tile texture
	 * @param tile tile to load
	 * @param source datasource
	 * @param onLoad callback
	 * @returns texture
	 */
	public load(
		source: ISource,
		tile: Tile,
		onLoad: () => void,
		onError: (err: ErrorEvent | DOMException | Event) => void,
	): Texture {
		// get the max level and bounds in tile
		const { url, bounds: rect } = getSafeTileUrlAndBounds(source, tile);

		if (!url) {
			setTimeout(onLoad, 10);
			return emptyTexture;
		}

		const texture = new Texture(new Image());
		texture.colorSpace = SRGBColorSpace;
		this.loader.load(
			url,
			// onLoad
			(image) => {
				// if the tile level is greater than max level, clip the max level parent of this tile image
				if (tile.coord.z > source.maxLevel) {
					texture.image = getSubImageFromRect(image, rect);
				} else {
					texture.image = image;
				}
				texture.needsUpdate = true;
				onLoad();
			},
			// onProgress
			undefined,
			// onError
			onError,
			tile.abortSignal,
		);

		return texture;
	}
}

/**
 * get sub image in rect from source image
 * @param image source image
 * @bounds  rect (orgin is (0,0), range is (-1,1))
 * @returns sub image
 */
function getSubImageFromRect(image: HTMLImageElement, bounds: Box2) {
	const size = image.width;
	const canvas = new OffscreenCanvas(size, size);
	const ctx = canvas.getContext("2d")!;
	const { sx, sy, sw, sh } = rect2ImageBounds(bounds, image.width);
	ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size);
	return canvas;
}
