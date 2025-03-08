/**
 *@description: Mapbox-RGB geometry loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { ImageLoader, MathUtils } from "three";
import { LoaderFactory, getBoundsCoord, TileGeometryLoader } from "../../loader";
import { parse } from "./parse";
import ParseWorker from "./parse.worker?worker&inline";

/**
 * Mapbox-RGB geometry loader
 */
export class TerrainRGBLoader extends TileGeometryLoader<HTMLImageElement> {
	// 数据类型标识
	public readonly dataType = "terrain-rgb";
	public discription = "Mapbox-RGB terrain loader, It can load Mapbox-RGB terrain data.";
	// 使用imageLoader下载
	private imageLoader = new ImageLoader(LoaderFactory.manager);

	// 下载数据
	protected async doLoad(url: string): Promise<HTMLImageElement> {
		return await this.imageLoader.loadAsync(url);
	}

	// 解析数据
	protected async doPrase(
		image: HTMLImageElement,
		_x: number,
		_y: number,
		z: number,
		clipBounds: [number, number, number, number],
	): Promise<Float32Array> {
		// 抽稀像素点
		const targetSize = MathUtils.clamp((z + 2) * 3, 2, 64);
		// 图像剪裁缩放
		const imgData = getImageDataFromRect(image, clipBounds, targetSize);
		// 是否使用worker
		if (this.useWorker) {
			return new Promise((resolve) => {
				const worker = new ParseWorker();
				// 解析完成收到DEM
				worker.onmessage = (e: MessageEvent<Float32Array>) => {
					resolve(e.data);
				};
				// 向workder传递参数
				worker.postMessage({ imgData }, imgData as any);
			});
		} else {
			// 将imageData解析成DEM
			return parse(imgData);
		}
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
function getImageDataFromRect(image: HTMLImageElement, bounds: [number, number, number, number], targetSize: number) {
	const cropRect = getBoundsCoord(bounds, image.width);
	targetSize = Math.min(targetSize, cropRect.sw);
	const canvas = new OffscreenCanvas(targetSize, targetSize);
	const ctx = canvas.getContext("2d")!;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, targetSize, targetSize);
	return ctx.getImageData(0, 0, targetSize, targetSize);
}
