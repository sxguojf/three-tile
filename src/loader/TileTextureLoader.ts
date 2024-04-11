/**
 *@description: texture loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, Texture } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";
import { ImageLoaderEx } from "./ImageLoaerEx";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndRect, rect2ImageBounds } from "./util";

const emptyexture = new Texture();

/**
 * texture loader
 */
export class TileTextureLoader {
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
		// get the max level and rect in tile
		const { url, rect } = getSafeTileUrlAndRect(source, tile);

		if (!url) {
			setTimeout(onLoad);
			return emptyexture;
		}

		const texture = new Texture(new Image());
		texture.colorSpace = source.colorSpace;
		this.loader.load(
			url,
			// onLoad
			(image) => {
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
 * get sub image from source image in rect
 * @param image source image
 * @rect  rect(orgin is (0,0), range is (-1,1))
 * @returns sub image
 */
function getSubImageFromRect(image: HTMLImageElement, rect: Box2) {
	const size = image.width;
	const canvas = new OffscreenCanvas(size, size);
	const ctx = canvas.getContext("2d")!;
	const { sx, sy, sw, sh } = rect2ImageBounds(rect, image.width);
	ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size);
	return canvas;
}
