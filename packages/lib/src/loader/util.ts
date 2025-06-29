/**
 *@description: Utils for loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Box2, Vector2 } from "three";
import { ISource } from "../source";

/**
 * Get bounds to clip image
 * @param clipBounds bounds [minx,miny,maxx,maxy],0-1
 * @param targetSize size to scale
 * @returns startX,StarY,width,height
 */
export function getBoundsCoord(clipBounds: [number, number, number, number], targetSize: number) {
	// left-top coordinate
	const sx = Math.floor(clipBounds[0] * targetSize);
	const sy = Math.floor(clipBounds[1] * targetSize);
	// width and height of the clipped image
	const sw = Math.floor((clipBounds[2] - clipBounds[0]) * targetSize);
	const sh = Math.floor((clipBounds[3] - clipBounds[1]) * targetSize);
	return { sx, sy, sw, sh };
}

/**
 * Get url and rect for max level tile
 * to load greater than max level from source,  had to load from max level.
 * 因为瓦片数据并未覆盖所有级别瓦片，如MapBox地形瓦片最高只到15级，如果要显示18级以上瓦片，不能从17级瓦片中获取，只能从15级瓦片里截取一部分
 * @param source
 * @param tile
 * @returns max tile url and bounds in  in maxTile
 */
export function getSafeTileUrlAndBounds(
	source: ISource,
	x: number,
	y: number,
	z: number
): {
	url: string | undefined;
	clipBounds: [number, number, number, number];
} {
	// 请求数据级别<最小级别返回空
	if (z < source.minLevel) {
		return {
			url: undefined,
			clipBounds: [0, 0, 1, 1],
		};
	}
	// 请数据级别<最大级别返回图片uil已经全部图片范围
	if (z <= source.maxLevel) {
		const url = source._getUrl(x, y, z);
		// const box = new Box2(new Vector2(-0.5, -0.5), new Vector2(0.5, 0.5));
		const clipBounds: [number, number, number, number] = [0, 0, 1, 1];
		return {
			url,
			clipBounds,
		};
	}

	// 取出数据源最大级别瓦片和当前瓦片在最大瓦片中的位置
	const maxLevelTileAndBox = getMaxLevelTileAndBounds(x, y, z, source.maxLevel);
	const pxyz = maxLevelTileAndBox.parentCoord;
	const url = source._getUrl(pxyz.x, pxyz.y, pxyz.z);

	return { url, clipBounds: maxLevelTileAndBox.bounds };
}

/**
 * get sub image in rect from source image
 * @param image source image
 * @bounds  rect (orgin is (0,0), range is (-1,1))
 * @returns sub image
 */
export function getSubImage(image: HTMLImageElement, bounds: [number, number, number, number]) {
	const size = image.width;
	const canvas = new OffscreenCanvas(size, size);
	const ctx = canvas.getContext("2d")!;
	const { sx, sy, sw, sh } = getBoundsCoord(bounds, image.width);
	ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size);
	return canvas;
}

function getMaxLevelTileAndBounds(x: number, y: number, z: number, maxLevel: number) {
	const dl = z - maxLevel;
	const parentCoord = { x: x >> dl, y: y >> dl, z: z - dl };
	const sep = Math.pow(2, dl);
	const size = Math.pow(0.5, dl);
	const xx = (x % sep) / sep - 0.5 + size / 2;
	const yy = (y % sep) / sep - 0.5 + size / 2;
	const parentCenter = new Vector2(xx, yy);

	const box = new Box2().setFromCenterAndSize(parentCenter, new Vector2(size, size));
	const bounds: [number, number, number, number] = [box.min.x + 0.5, box.min.y + 0.5, box.max.x + 0.5, box.max.y + 0.5];

	return { parentCoord, bounds };
}

/**
 * 将瓦片影像超出mapBounds范围的部分设为透明
 * @param image 原始瓦片图像，类型可以是 OffscreenCanvas 或 HTMLImageElement
 * @param mapBounds 地图范围，格式为 [minX, minY, maxX, maxY]
 * @param tileBounds 瓦片范围，格式为 [minX, minY, maxX, maxY]
 * @returns 处理后的图像，可能是原始图像或处理后的 OffscreenCanvas
 */
export function tileBoundsClip(
	image: OffscreenCanvas | HTMLImageElement,
	mapBounds: [number, number, number, number],
	tileBounds: [number, number, number, number]
) {
	// 瓦片完全在地图范围内，直接返回原始图像
	if (
		mapBounds[0] <= tileBounds[0] &&
		mapBounds[1] <= tileBounds[1] &&
		mapBounds[2] >= tileBounds[2] &&
		mapBounds[3] >= tileBounds[3]
	) {
		return image;
	}

	// 1. 计算交集矩形（世界坐标系）
	const [mapMinX, mapMinY, mapMaxX, mapMaxY] = mapBounds;
	const [tileMinX, tileMinY, tileMaxX, tileMaxY] = tileBounds;
	const intersectLeft = Math.max(mapMinX, tileMinX);
	const intersectTop = Math.max(mapMinY, tileMinY);
	const intersectRight = Math.min(mapMaxX, tileMaxX);
	const intersectBottom = Math.min(mapMaxY, tileMaxY);

	// 瓦片完全在地图范围之外，直接返回原始图像
	if (intersectLeft >= intersectRight || intersectTop >= intersectBottom) {
		return image;
	}

	// 2. 创建结果Canvas,绘制原始瓦片
	const canvas = new OffscreenCanvas(image.width, image.height);
	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(image, 0, 0);

	// 计算瓦片与地图的交集（地理坐标系，Y轴向上）
	const intersectMinX = Math.max(tileMinX, mapMinX);
	const intersectMaxX = Math.min(tileMaxX, mapMaxX);
	const intersectMinY = Math.max(tileMinY, mapMinY); // 地图坐标系中的最小值（南边）
	const intersectMaxY = Math.min(tileMaxY, mapMaxY); // 地图坐标系中的最大值（北边）

	// 将交集外的区域设为透明
	ctx.globalCompositeOperation = "destination-in";

	// 计算在瓦片图像上的相对位置和尺寸
	const tileWidth = tileMaxX - tileMinX;
	const tileHeight = tileMaxY - tileMinY;

	// 坐标转换
	const x1 = ((intersectMinX - tileMinX) / tileWidth) * canvas.width;
	const x2 = ((intersectMaxX - tileMinX) / tileWidth) * canvas.width;
	const y1 = canvas.height - ((intersectMaxY - tileMinY) / tileHeight) * canvas.height;
	const y2 = canvas.height - ((intersectMinY - tileMinY) / tileHeight) * canvas.height;

	// 绘制矩形保留交集区域
	ctx.beginPath();
	ctx.rect(x1, y1, x2 - x1, y2 - y1);
	ctx.fill();

	// 返回处理后的 Canvas
	return canvas;
}
