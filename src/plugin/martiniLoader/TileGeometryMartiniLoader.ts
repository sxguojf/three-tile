/**
 *@description: Mapbox-RGB + Martini geometry loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, BufferGeometry } from "three";
import { ISource } from "../../source";
import {
	ITileGeometryLoader,
	ImageLoaderEx,
	LoaderFactory,
	getSafeTileUrlAndBounds,
	rect2ImageBounds,
} from "../../loader";
import { TileMartiniGeometry } from "./TileMartiniGeometry";

/**
 * Mapbox-RGB geometry loader
 */
export class TileGeometryMartiniLoader implements ITileGeometryLoader {
	public readonly dataType = "terrain-rgb-martini";
	private imageLoader = new ImageLoaderEx(LoaderFactory.manager);

	/**
	 * load tile's data from source
	 * @param source
	 * @param tile
	 * @param onLoad
	 * @param onError
	 * @returns
	 */
	public load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): BufferGeometry {
		const geometry = new TileMartiniGeometry();
		// get max level tile and bounds
		const { url, bounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (url) {
			this._load(url, x, y, z, geometry, bounds, onLoad, abortSignal);
		} else {
			setTimeout(onLoad);
		}
		return geometry;
	}

	private _load(
		url: string,
		x: number,
		y: number,
		z: number,
		geometry: TileMartiniGeometry,
		bounds: Box2,
		onLoad: () => void,
		abortSignal: AbortSignal,
	) {
		this.imageLoader.load(
			url,
			(image) => {
				const imgData = getImageDataFromRect(image, bounds);
				const dem = getTerrain(imgData);
				geometry.setData(dem, x, y, z);
				onLoad();
			},
			undefined,
			onLoad,
			abortSignal,
		);
		return geometry;
	}
}

/**
 * Get terrain points from image data.
 *
 * @param data - Terrain data encoded as image.
 * @returns The terrain elevation as a Float32 array.
 */
function getTerrain(imageData: ImageData): Float32Array {
	const data = imageData.data;
	const tileSize = imageData.width;
	const gridSize = tileSize + 1;

	// From Martini demo
	// https://observablehq.com/@mourner/martin-real-time-rtin-terrain-mesh
	const terrain = new Float32Array(gridSize * gridSize);

	// Decode terrain values
	for (let i = 0, y = 0; y < tileSize; y++) {
		for (let x = 0; x < tileSize; x++, i++) {
			// 透明像素直接返回高度0
			if (data[i * 4 + 3] === 0) {
				terrain[i + y] = 0;
			}
			const k = i * 4;
			const r = data[k + 0];
			const g = data[k + 1];
			const b = data[k + 2];

			const rgb = (r << 16) | (g << 8) | b;
			terrain[i + y] = rgb / 10000 - 10;
		}
	}

	// Backfill bottom border
	for (let i = gridSize * (gridSize - 1), x = 0; x < gridSize - 1; x++, i++) {
		terrain[i] = terrain[i - gridSize];
	}

	// Backfill right border
	for (let i = gridSize - 1, y = 0; y < gridSize; y++, i += gridSize) {
		terrain[i] = terrain[i - 1];
	}

	return terrain;
}

/**
 * Get pixels in bounds from image and resize to targetSize
 * 从image中截取bounds区域子图像，缩放到targetSize大小，返回其中的像素数组
 * @param image 源图像
 * @param bounds clip bounds
 * @param targetSize dest size
 * @returns imgData
 */
function getImageDataFromRect(image: HTMLImageElement, bounds: Box2) {
	// 取得子图像范围
	const cropRect = rect2ImageBounds(bounds, image.width);
	const targetSize = Math.min(256, cropRect.sw);
	const canvas = new OffscreenCanvas(targetSize, targetSize);
	const ctx = canvas.getContext("2d")!;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, targetSize, targetSize);
	return ctx.getImageData(0, 0, targetSize, targetSize);
}
