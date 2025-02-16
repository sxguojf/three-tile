/**
 *@description: Mapbox-RGB geometry loader
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
			this._load(url, z, geometry, bounds, onLoad, abortSignal);
		} else {
			setTimeout(onLoad);
		}
		return geometry;
	}

	private _load(
		url: string,
		z: number,
		geometry: TileMartiniGeometry,
		bounds: Box2,
		onLoad: () => void,
		abortSignal: AbortSignal,
	) {
		this.imageLoader.load(
			url,
			// onLoad
			(image) => {
				if (!abortSignal.aborted) {
					const imgData = getImageDataFromRect(image, bounds);
					geometry.setData(imgData.data, z);
				}
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
