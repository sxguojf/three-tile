/**
 *@description: Mapbox-RGB geometry loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, BufferGeometry, PlaneGeometry } from "three";
import { TileDEMGeometry } from "../geometry";
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
class TileGeometryRGBLoader implements ITileGeometryLoader {
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
	public load(source: ISource, tile: Tile, onLoad: () => void): BufferGeometry {
		// get max level tile and rect
		const { url, bounds: rect } = getSafeTileUrlAndBounds(source, tile);

		if (!url) {
			setTimeout(onLoad);
			return new PlaneGeometry();
		} else {
			return this._load(tile, url, rect, onLoad);
		}
	}

	private _load(tile: Tile, url: string, bounds: Box2, onLoad: () => void) {
		const tileSize = (tile.coord.z + 2) * 3;
		const geometry = this.createGeometry();
		this.imageLoader.load(
			url,
			// onLoad
			(image) => {
				if (!tile.abortSignal.aborted) {
					const imgData = getImageDataFromRect(image, bounds, tileSize);
					geometry.setData(Img2dem(imgData.data));
				}
				onLoad();
			},
			// onProgress
			undefined,
			// onError
			onLoad,
			tile.abortSignal,
		);
		return geometry;
	}

	protected createGeometry() {
		return new TileDEMGeometry();
	}
}

// RGB to dem (Mapbox Terrain-RGB v1)
// https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-rgb-v1/
function getZ(imgData: Uint8ClampedArray, i: number) {
	// 透明像素直接返回高度0
	if (imgData[i * 4 + 3] === 0) {
		return 0;
	}
	const rgb = (imgData[i * 4] << 16) | (imgData[i * 4 + 1] << 8) | imgData[i * 4 + 2];
	return rgb / 10000 - 10;
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
