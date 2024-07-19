/**
 *@description: rigester Mapbox-RGB geometry loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, Loader, PlaneGeometry } from "three";
import { TileGridGeometry } from "../geometry";
import { ISource } from "../source";
import { Tile } from "../tile";
import { ITileGeometryLoader } from "./ITileLoaders";
import { ImageLoaderEx } from "./ImageLoaerEx";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndBounds, rect2ImageBounds } from "./util";

// const EmptyGeometry = new PlaneGeometry();
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
		// get max level tile and rect
		const { url, bounds: rect } = getSafeTileUrlAndBounds(source, tile);

		if (!url) {
			setTimeout(onLoad, 100);
			return new PlaneGeometry();
		} else {
			return this._load(tile, url, rect, onLoad, onError);
		}
	}

	private _load(tile: Tile, url: any, rect: Box2, onLoad: () => void, onError: (err: any) => void) {
		// 降低高程瓦片分辨率，以提高速度
		// get tile size in pixel
		const tileSize = tile.coord.z * 3;
		// tileSize = MathUtils.clamp(tileSize, 2, 48);

		const geometry = this.createGeometry();
		this.imageLoader.load(
			url,
			// onLoad
			(image) => {
				const imgData = getImageDataFromRect(image, rect, tileSize);
				geometry.setData(Img2dem(imgData.data), imgData.width);
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
	// 透明像素直接返回高度0
	if (imgData[i * 4 + 3] === 0) {
		return 0;
	}
	const r = imgData[i * 4];
	const g = imgData[i * 4 + 1];
	const b = imgData[i * 4 + 2];
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
 * Get pixels in bounds from image and resize to targetSize
 * 从image中截取bounds区域子图像，缩放到targetSize大小，返回其中的像素数组
 * @param image 源图像
 * @param bounds clip bounds
 * @param targetSize dest size
 * @returns imgData
 */
function getImageDataFromRect(image: HTMLImageElement, bounds: Box2, targetSize: number) {
	// 取得子图像范围
	const cropRect = rect2ImageBounds(bounds, image.width);
	targetSize = Math.min(targetSize, cropRect.sw);
	const canvas = new OffscreenCanvas(targetSize, targetSize);
	const ctx = canvas.getContext("2d")!;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, targetSize, targetSize);
	return ctx.getImageData(0, 0, targetSize, targetSize);
}

LoaderFactory.registerGeometryLoader(new TileGeometryRGBLoader());
