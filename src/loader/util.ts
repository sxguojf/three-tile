/**
 *@description: Utils functions
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Box2, Vector2, Vector3 } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";

/**
 * Get bounds from rect
 * @param rect
 * @param imgSize
 * @returns
 */
export function rect2ImageBounds(rect: Box2, imgSize: number) {
	rect.translate(new Vector2(0.5, 0.5));
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
export function getSafeTileUrlAndBounds(source: ISource, tile: Tile) {
	// 请求数据级别<最小级别返回空
	if (tile.z < source.minLevel) {
		return {
			url: undefined,
		};
	}
	// 请数据级别<最大级别返回图片uil已经全部图片范围
	if (tile.z <= source.maxLevel) {
		const url = source.getTileUrl(tile.x, tile.y, tile.z);
		return {
			url,
			bounds: new Box2(new Vector2(-0.5, -0.5), new Vector2(0.5, 0.5)),
		};
	}

	// 请求数据级别>最大级别，取数据源的最大级别瓦片url和子瓦片其中的范围

	// 取出数据源最大级别瓦片和当前瓦片在最大瓦片中的位置
	const maxLevelTileAndBox = getMaxLevelTileAndBounds(tile, source.maxLevel);
	// 取得瓦片的url
	const url = source.getTileUrl(maxLevelTileAndBox.tile.x, maxLevelTileAndBox.tile.y, maxLevelTileAndBox.tile.z);
	return { url, bounds: maxLevelTileAndBox.bounds };
}

function getMaxLevelTileAndBounds(tile: Tile, maxLevel: number) {
	const center = new Vector3();
	const size = new Vector2(1, 1);
	// 循环找到最高级别瓦片，并取得瓦片中点相对于最高级别瓦片的中点和大小
	while (tile.z > maxLevel) {
		// 瓦片中点转为相对本瓦片坐标（Mesh.positon为相对父瓦片坐标系中的坐标）
		center.applyMatrix4(tile.matrix);
		// 一级是上一级0.5倍大小
		size.multiplyScalar(0.5);
		if (tile.parent instanceof Tile) {
			tile = tile.parent;
		} else {
			break;
		}
	}
	// 因坐瓦片坐标与图像坐标系Y轴相反，所以取反
	center.setY(-center.y);
	const bounds = new Box2().setFromCenterAndSize(new Vector2(center.x, center.y), size);
	return { tile, bounds };
}
