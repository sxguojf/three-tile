/**
 *@description: Mapbox-RGB geometry loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { MathUtils } from "three";
import { ImageLoaderEx, LoaderFactory, getBoundsCoord, TileGeometryLoader } from "../../loader";
import { parse } from "./parse";
import ParseWorker from "./parse.worker?worker&inline";

/**
 * Mapbox-RGB geometry loader
 */
export class TerrainRGBLoader extends TileGeometryLoader<HTMLImageElement> {
	// 数据类型标识
	public readonly dataType = "terrain-rgb";
	// 使用imageLoader下载
	private imageLoader = new ImageLoaderEx(LoaderFactory.manager);

	// 下载数据
	protected doLoad(
		url: string,
		onLoad: (data: HTMLImageElement) => void,
		onError: (event: ErrorEvent | Event | DOMException) => void,
		abortSignal: AbortSignal,
	): void {
		// 下载图像
		this.imageLoader.load(
			url,
			(image) => onLoad(image), // onLoad, 加载完成
			undefined, // onProgress, 加载进度，不支持
			onError, // onError, 加载错误
			abortSignal, // 下载中止信号
		);
	}

	// 解析数据
	protected doPrase(
		image: HTMLImageElement,
		_x: number,
		_y: number,
		z: number,
		clipBounds: [number, number, number, number],
		onParse: (GeometryData: Float32Array) => void,
	) {
		// 抽稀像素点
		const targetSize = MathUtils.clamp((z + 2) * 3, 2, 64);
		// 图像剪裁缩放
		const imgData = getImageDataFromRect(image, clipBounds, targetSize);
		// 是否使用worker
		if (this.useWorker) {
			const worker = new ParseWorker();
			// 解析完成收到DEM
			worker.onmessage = (e: MessageEvent<Float32Array>) => {
				onParse(e.data);
			};
			// 向workder传递参数
			worker.postMessage({ imgData }, imgData as any);
		} else {
			// 将imageData解析成DEM
			onParse(parse(imgData));
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
