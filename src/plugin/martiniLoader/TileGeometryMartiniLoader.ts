/**
 *@description: Mapbox-RGB + Martini geometry loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry } from "three";
import { GeometryDataType, TileGeometry } from "../../geometry";
import { ITileGeometryLoader, ImageLoaderEx, LoaderFactory, getSafeTileUrlAndBounds } from "../../loader";
import { ISource } from "../../source";
import { parse } from "./parse";
import ParseWorker from "./parse.worker?worker&inline";

/**
 * Mapbox-RGB Martini geometry loader
 */
export class TileGeometryMartiniLoader implements ITileGeometryLoader {
	public readonly dataType = "terrain-rgb-martini";

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
			this._load(url, x, y, z, geometry, bounds, onLoad, abortSignal);
		} else {
			onLoad();
		}
		return geometry;
	}

	private _load(
		url: string,
		_x: number,
		_y: number,
		z: number,
		geometry: TileGeometry,
		bounds: [number, number, number, number],
		onLoad: () => void,
		abortSignal: AbortSignal,
	) {
		this.imageLoader.load(
			url,
			(image) => {
				// 取得图像数据
				const imgData = getImageDataFromRect(image, bounds);

				// 是否使用worker解析
				if (this.useWorker) {
					const worker = new ParseWorker();
					worker.onmessage = (e: MessageEvent<GeometryDataType>) => {
						geometry.setData(e.data);
						onLoad();
					};
					worker.postMessage({ z, imgData }, imgData as any);
				} else {
					const geometryInfo = parse(imgData, z);
					geometry.setData(geometryInfo);
					onLoad();
				}
			},
			undefined,
			onLoad,
			abortSignal,
		);
		return geometry;
	}
}

function rect2ImageBounds(clipBounds: [number, number, number, number], imgSize: number) {
	// left-top coordinate
	const sx = Math.floor(clipBounds[0] * imgSize);
	const sy = Math.floor(clipBounds[1] * imgSize);
	// width and height of the clipped image
	const sw = Math.floor((clipBounds[2] - clipBounds[0]) * imgSize);
	const sh = Math.floor((clipBounds[3] - clipBounds[1]) * imgSize);
	return { sx, sy, sw, sh };
}

/**
 * Get pixels in bounds from image and resize to targetSize
 * 从image中截取bounds区域子图像，缩放到targetSize大小，返回其中的像素数组
 * @param image 源图像
 * @param bounds clip bounds
 * @param targetSize dest size
 * @returns imgData
 */
function getImageDataFromRect(image: HTMLImageElement, bounds: [number, number, number, number]) {
	// 取得子图像范围
	const cropRect = rect2ImageBounds(bounds, image.width);
	const targetSize = Math.min(256, cropRect.sw);
	const canvas = new OffscreenCanvas(targetSize, targetSize);
	const ctx = canvas.getContext("2d")!;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, targetSize, targetSize);
	return ctx.getImageData(0, 0, targetSize, targetSize);
}
