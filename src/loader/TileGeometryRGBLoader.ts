/**
 *@description: rigester Mapbox-RGB geometry loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, BufferGeometry, Loader, MathUtils } from "three";
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
		// 降低高程瓦片分辨率，以提高速度
		// get tile size in pixel
		let tileSize = tile.coord.z * 3;
		tileSize = MathUtils.clamp(tileSize, 2, 48);

		const geometry = this.createGeometry();
		this.imageLoader.load(
			url,
			// onLoad
			(image) => {
				const { data, size } = getImageDataFromRect(image, rect, tileSize);
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
 * get pixel from image
 * 从图片中截取指定区域子图像，缩放到size大小，返回其中的像素数组
 * todo: 此处可能有bug，待确认
 * @param image 源图像
 * @param bounds clip bounds
 * @param targetSize dest size
 * @returns pixel
 */
function getImageDataFromRect(image: HTMLImageElement, bounds: Box2, targetSize: number) {
	// 取得子图像范围
	const cropRect = rect2ImageBounds(bounds, image.width);
	// 如果需要的瓦片大小>截取的图片大小，则只用截取的大小，比如我想要48*48的瓦片，但是截取的图片只有32*32，那么就只用32*32
	targetSize = Math.min(targetSize, cropRect.sw);

	const canvas = new OffscreenCanvas(targetSize, targetSize);
	const ctx = canvas.getContext("2d")!;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, targetSize, targetSize);
	const result = { data: ctx.getImageData(0, 0, targetSize, targetSize).data, size: targetSize };
	if (result.data.length != targetSize * targetSize * 4) {
		console.error("image size error");
	}
	return result;
}

LoaderFactory.registerGeometryLoader(new TileGeometryRGBLoader());

// function getSubImageFromRect(image: HTMLImageElement, rect: Box2) {
// 	const size = image.width;
// 	const canvas = new OffscreenCanvas(size, size);
// 	const ctx = canvas.getContext("2d")!;
// 	const { sx, sy, sw, sh } = rect2ImageBounds(rect, image.width);
// 	ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size);
// 	return canvas;
// }
