/**
 *@description: ArcGis-lerc data parser
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Martini } from "../../geometry/Martini";
import { GeometryDataType } from "../../geometry/GeometryDataTypes";
//@ts-ignore
import Lerc from "./lercDecode.js";

type DEMType = {
	dem: Float32Array;
	width: number;
	height: number;
};

const maxErrors: { [key: number]: number } = {
	0: 7000,
	1: 6000,
	2: 5000,
	3: 4000,
	4: 3000,
	5: 2500,
	6: 2000,
	7: 1500,
	8: 800,
	9: 500,
	10: 200,
	11: 100,
	12: 40,
	13: 12,
	14: 5,
	15: 2,
	16: 1,
	17: 0,
	18: 0,
	19: 0,
	20: 0,
};

/**
 * 解码给定缓冲区中的Lerc数据
 *
 * @param buffer Lerc编码数据的ArrayBuffer
 * @returns 解码后的高度图数据、宽度和高度的对象
 */
function decode(buffer: ArrayBuffer): DEMType {
	const data = Lerc.decode(buffer);
	return { dem: data.pixels[0], width: data.width, height: data.height };
}

/**
 * 解析Lerc编码数据，根据层级和裁剪边界返回martini几何体数据
 * @param buffer Lerc编码数据的ArrayBuffer
 * @param z 瓦片层级
 * @param clipBounds 裁剪边界，格式为 [xmin, ymin, xmax, ymax]
 * @returns 解析后的GeometryDataType对象
 */
export function parse(buffer: ArrayBuffer, z: number, clipBounds: [number, number, number, number]): GeometryDataType {
	// 解码Lerc数据
	let demData = decode(buffer);

	// 剪裁数据
	if (clipBounds[2] - clipBounds[0] < 1) {
		demData = getSubDEM(demData, clipBounds);
	}

	// 构建Martini地形
	const martini = new Martini(demData.width);
	const tile = martini.createTile(demData.dem);
	// 返回Geometry数据
	return tile.getGeometryData(maxErrors[z] || 0);
}

/**
 * 根据给定的坐标范围剪裁高度图数据
 * @param demData 原始高度图数据
 * @param bounds 裁剪边界，格式为 [xmin, ymin, xmax, ymax]
 * @returns 剪裁后的高度图数据
 */
function getSubDEM(demData: DEMType, bounds: [number, number, number, number]): DEMType {
	// 取得需要截取的数据起始索引坐标和宽度高度
	const getClipCoord = (clipBounds: [number, number, number, number], dw: number, dh: number) => {
		// 左上角坐标
		const x = Math.floor(clipBounds[0] * dw);
		const y = Math.floor(clipBounds[1] * dh);
		// 宽度和高度（必须为2^n+1）
		const w = Math.floor((clipBounds[2] - clipBounds[0]) * dw) + 1;
		const h = Math.floor((clipBounds[3] - clipBounds[1]) * dh) + 1;
		return { x, y, w, h };
	};

	// 根据给定的坐标范围剪裁数据
	const clip = (buffer: Float32Array, width: number, sx: number, sy: number, w: number, h: number) => {
		const clippedData = new Float32Array(w * h);
		for (let row = 0; row < h; row++) {
			for (let col = 0; col < w; col++) {
				const sourceIndex = (row + sy) * width + (col + sx);
				const destIndex = row * w + col;
				clippedData[destIndex] = buffer[sourceIndex];
			}
		}
		return clippedData;
	};

	const piexlRect = getClipCoord(bounds, demData.width, demData.height);
	const dem = clip(demData.dem, demData.width, piexlRect.x, piexlRect.y, piexlRect.w, piexlRect.h);
	return { dem, width: piexlRect.w, height: piexlRect.h };
}
