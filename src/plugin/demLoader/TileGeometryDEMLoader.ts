/**
 *@description: rigester Mapbox-RGB geometry loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, BufferGeometry, PlaneGeometry } from "three";
import {
	ITileGeometryLoader,
	ImageLoaderEx,
	LoaderFactory,
	getSafeTileUrlAndBounds,
	rect2ImageBounds,
} from "../../loader";
import { ISource } from "../../source";
import { Tile } from "../../tile";
import { TileDEMGeometry } from "./TileDEMGeometry";

// const EmptyGeometry = new PlaneGeometry();
/**
 * Mapbox-RGB geometry loader
 */
export class TileGeometryDEMLoader implements ITileGeometryLoader {
	public readonly dataType = "terrain-dem";
	private imageLoader = new ImageLoaderEx(LoaderFactory.manager);

	/**
	 * load tile data from source
	 * @param source
	 * @param tile
	 * @param onLoad
	 * @param onError
	 * @returns
	 */
	public load(source: ISource, tile: Tile, onLoad: () => void, abortSignal: AbortSignal): BufferGeometry {
		// get max level tile and rect
		const { url, bounds } = getSafeTileUrlAndBounds(source, tile);

		if (!url) {
			setTimeout(onLoad);
			return new PlaneGeometry();
		} else {
			return this._load(tile, url, bounds, onLoad, abortSignal);
		}
	}

	private _load(tile: Tile, url: any, rect: Box2, onLoad: () => void, abortSignal: AbortSignal) {
		const tileSize = (tile.z + 2) * 3;
		const geometry = this.createGeometry();
		this.imageLoader.load(
			url,
			// onLoad
			(image) => {
				if (abortSignal.aborted) {
					const imgData = getImageDataFromRect(image, rect, tileSize);
					geometry.setData(Img2dem(imgData.data), imgData.width);
				}
				onLoad();
			},
			// onProgress
			undefined,
			// onError
			onLoad,
			abortSignal,
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
	// const r = imgData[i * 4];
	// const g = imgData[i * 4 + 1];
	// const b = imgData[i * 4 + 2];
	// return (((r << 16) + (g << 8) + b) * 0.1 - 10000.0) / 1000.0;

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
