/**
 *@description: Mapbox-RGB geometry loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, BufferGeometry, MathUtils } from "three";
import { GeometryInfo, TileGeometry } from "../../geometry";
import { ISource } from "../../source";
import {
	LoaderFactory,
	ImageLoaderEx,
	ITileGeometryLoader,
	getSafeTileUrlAndBounds,
	rect2ImageBounds,
} from "../../loader";
import { parse } from "./parse";
import ParseWorker from "./parse.worker?worker&inline";

/**
 * Mapbox-RGB geometry loader
 */
export class TerrainRGBLoader implements ITileGeometryLoader {
	public readonly dataType = "terrain-rgb";

	private _useWorker = true;
	/** get use worker */
	public get useWorker() {
		return this._useWorker;
	}
	/** set use worker */
	public set useWorker(value: boolean) {
		this._useWorker = value;
	}

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
		const geometry = new TileGeometry();
		// get max level tile and bounds
		const { url, bounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (url) {
			let tileSize = (z + 2) * 3;
			tileSize = MathUtils.clamp(tileSize, 2, 48);
			this._load(url, geometry, bounds, tileSize, onLoad, abortSignal);
		} else {
			setTimeout(onLoad);
		}
		return geometry;
	}

	private _load(
		url: string,
		geometry: TileGeometry,
		bounds: Box2,
		tileSize: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	) {
		this.imageLoader.load(
			url,
			// onLoad
			(image) => {
				const imgData = getImageDataFromRect(image, bounds, tileSize);

				// 是否使用worker解析
				if (this.useWorker) {
					const worker = new ParseWorker();
					worker.onmessage = (e: MessageEvent<GeometryInfo>) => {
						geometry.setData(e.data);
						onLoad();
					};
					worker.postMessage({ imgData }, imgData as any);
				} else {
					geometry.setData(parse(imgData));
					onLoad();
				}
			},
			// onProgress
			undefined,
			// onError
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
