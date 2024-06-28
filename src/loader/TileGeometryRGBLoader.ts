/**
 *@description: rigester Mapbox-RGB geometry loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, BufferGeometry, Loader, PlaneGeometry } from "three";
import { TileGridGeometry } from "../geometry";
import { ISource } from "../source";
import { Tile } from "../tile";
import { ITileGeometryLoader } from "./ITileLoaders";
import { ImageLoaderEx } from "./ImageLoaerEx";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndRect, rect2ImageBounds } from "./util";

const EmptyGeometry = new BufferGeometry();
/**
 * Mapbox-RGB geometry loader
 */
class TileGeometryRGBLoader extends Loader implements ITileGeometryLoader {
	public readonly dataType = "terrain-rgb";
	private imageLoader = new ImageLoaderEx(LoaderFactory.manager);

	/**
	 * load tile's data from source
	 * @param source
	 * @param tile
	 * @param onLoad
	 * @param onError
	 * @returns
	 */
	public load(source: ISource, tile: Tile, onLoad: () => void, onError: (err: any) => void) {
		// discard dem if level<8
		if (tile.coord.z < 8) {
			setTimeout(onLoad);
			return new PlaneGeometry();
		}
		// get max level tile and rect
		const { url, rect } = getSafeTileUrlAndRect(source, tile);

		if (!url) {
			setTimeout(onLoad);
			return EmptyGeometry;
		}

		const geometry = this._load(tile, url, rect, onLoad, onError);

		return geometry;
	}

	private _load(tile: Tile, url: any, rect: Box2, onLoad: () => void, onError: (err: any) => void) {
		// get tile size in pixel
		let tileSize = tile.coord.z * 3;
		tileSize = Math.min(Math.max(tileSize, 2), 48);

		const geometry = this.createGeometry();
		this.imageLoader.load(
			url,
			// onLoad
			(image) => {
				const { data, size } = getImageDataFromRect(image, tileSize, rect);
				geometry.setData(Img2dem(data), size);
				onLoad();
			},
			// onProgress
			undefined,
			// onError
			onError,
			tile.abortSignal,
		);
		return geometry;
	}

	protected createGeometry() {
		return new TileGridGeometry();
	}
}

// RGB to dem (Mapbox Terrain-RGB v1)
// https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-rgb-v1/
function getZ(imgData: Uint8ClampedArray, i: number) {
	const r = imgData[i * 4];
	const g = imgData[i * 4 + 1];
	const b = imgData[i * 4 + 2];
	// return ((r * 256.0 * 256.0 + g * 256.0 + b) * 0.1 - 10000.0) / 1000.0;
	return (((r << 16) + (g << 8) + b) * 0.1 - 10000.0) / 1000.0;
}

function Img2dem(imgData: Uint8ClampedArray) {
	const count = Math.floor(imgData.length / 4);
	const dem = new Float32Array(count);
	for (let i = 0; i < dem.length; i++) {
		dem[i] = getZ(imgData, i);
	}
	return dem;
}

/**
 * get pixel from image
 * @param image
 * @param size dest size
 * @param rect source rect
 * @returns pixel
 */
function getImageDataFromRect(image: HTMLImageElement, size: number, rect: Box2) {
	const canvas = new OffscreenCanvas(size, size);
	const ctx = canvas.getContext("2d")!;
	ctx.imageSmoothingEnabled = false;
	const prect = rect2ImageBounds(rect, image.width);
	if (size > prect.sw) {
		size = prect.sw;
	}
	//const { sx, sy, sw, sh } = rect2ImageBounds(rect, image.width);
	ctx.drawImage(image, prect.sx, prect.sy, prect.sw, prect.sh, 0, 0, size, size);
	return { data: ctx.getImageData(0, 0, size, size).data, size };
}

LoaderFactory.registerGeometryLoader(new TileGeometryRGBLoader());
