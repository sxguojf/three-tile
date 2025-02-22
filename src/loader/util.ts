/**
 *@description: Utils functions
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, Vector2 } from "three";
import { ISource } from "../source";

/**
 * Get bounds from rect
 * @param rect
 * @param imgSize
 * @returns
 */
export function rect2ImageBounds(rect: Box2, imgSize: number) {
	rect.min.x += 0.5;
	rect.max.x += 0.5;
	rect.min.y += 0.5;
	rect.max.y += 0.5;
	// left-top
	const sx = Math.floor(rect.min.x * imgSize);
	const sy = Math.floor(rect.min.y * imgSize);
	// w and h
	const sw = Math.floor((rect.max.x - rect.min.x) * imgSize);
	const sh = Math.floor((rect.max.y - rect.min.y) * imgSize);
	return { sx, sy, sw, sh };
}

/**
 * Image resize
 * @param image source image
 * @param size dest size
 * @returns canvas
 */
export function imageResize(image: HTMLImageElement, size: number) {
	if (image.width <= size) {
		return image;
	}
	// create a canvas
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d")!;

	// set the canvas size
	canvas.width = size;
	canvas.height = size;

	// get scale size
	const scaledSize = size - 2;

	// draw
	context.drawImage(image, 0, 0, image.width, image.height, 1, 1, scaledSize, scaledSize);

	// draw bounds (skrit)
	const imageData = context.getImageData(1, 1, scaledSize, scaledSize);
	context.putImageData(imageData, 0, 0);

	return canvas;
}

/**
 * Get url and rect for max level tile
 * to load greater than max level from source,  had to load from max level.
 * 因为瓦片数据并未覆盖所有级别瓦片，如MapBox地形瓦片最高只到15级，如果要显示18级以上瓦片，不能从17级瓦片中获取，只能从15级瓦片里截取一部分
 * @param source
 * @param tile
 * @returns max tile url and rect in  in maxTile
 */
export function getSafeTileUrlAndBounds(source: ISource, x: number, y: number, z: number) {
	// 请求数据级别<最小级别返回空
	if (z < source.minLevel) {
		return {
			url: undefined,
		};
	}
	// 请数据级别<最大级别返回图片uil已经全部图片范围
	if (z <= source.maxLevel) {
		const url = source._getTileUrl(x, y, z);
		return {
			url,
			bounds: new Box2(new Vector2(-0.5, -0.5), new Vector2(0.5, 0.5)),
		};
	}

	// 取出数据源最大级别瓦片和当前瓦片在最大瓦片中的位置
	const maxLevelTileAndBox = getMaxLevelTileAndBounds(x, y, z, source.maxLevel);
	// 取得瓦片的url
	const url = source._getTileUrl(
		maxLevelTileAndBox.parentNO.x,
		maxLevelTileAndBox.parentNO.y,
		maxLevelTileAndBox.parentNO.z,
	);

	return { url, bounds: maxLevelTileAndBox.bounds };
}

function getMaxLevelTileAndBounds(x: number, y: number, z: number, maxLevel: number) {
	const dl = z - maxLevel;
	const parentNO = { x: x >> dl, y: y >> dl, z: z - dl };
	const sep = Math.pow(2, dl);
	const size = Math.pow(0.5, dl);
	const xx = (x % sep) / sep - 0.5 + size / 2;
	const yy = (y % sep) / sep - 0.5 + size / 2;
	const parentCenter = new Vector2(xx, yy);

	const bounds = new Box2().setFromCenterAndSize(parentCenter, new Vector2(size, size));

	return { parentNO, bounds };
}
