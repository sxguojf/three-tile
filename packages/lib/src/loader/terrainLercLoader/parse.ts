/**
 *@description: ArcGis-lerc data parser
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Martini } from "../../geometry/Martini";

export type DEMType = {
	array: Float32Array;
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
	17: 0.5,
	18: 0.2,
	19: 0.1,
	20: 0.05,
};

export function parse(data: DEMType, z: number, clipBounds: [number, number, number, number]) {
	let demData = data;
	// 地形从父瓦片取需要剪裁
	if (clipBounds[2] - clipBounds[0] < 1) {
		// 从父瓦片取地形数据
		demData = getSubDEM(data, clipBounds);
	}

	const { array: terrain, width: gridSize } = demData;

	// 构建Martin
	const martini = new Martini(gridSize);
	// 简化
	const tile = martini.createTile(terrain);
	// 几何误差
	const maxError = maxErrors[z] / 1000 || 0;
	// 返回Geometry数据
	return tile.getGeometryData(maxError);
}

function getSubDEM(demData: DEMType, bounds: [number, number, number, number]): DEMType {
	// 数组剪裁并缩放
	function arrayclipAndResize(
		buffer: Float32Array,
		width: number,
		sx: number,
		sy: number,
		sw: number,
		sh: number,
		dw: number,
		dh: number
	) {
		// clip
		const clippedData = new Float32Array(sw * sh);
		for (let row = 0; row < sh; row++) {
			for (let col = 0; col < sw; col++) {
				const sourceIndex = (row + sy) * width + (col + sx);
				const destIndex = row * sw + col;
				clippedData[destIndex] = buffer[sourceIndex];
			}
		}

		// resize
		const resizedData = new Float32Array(dh * dw);
		for (let row = 0; row < dh; row++) {
			for (let col = 0; col < dw; col++) {
				const destIndex = row * dh + col;
				const sourceX = Math.round((col * sh) / dh);
				const sourceY = Math.round((row * sw) / dw);
				const sourceIndex = sourceY * sw + sourceX;
				resizedData[destIndex] = clippedData[sourceIndex];
			}
		}

		return resizedData;
	}

	const piexlRect = getBoundsCoord(bounds, demData.width);
	// Martini需要瓦片大小为n*2+1
	const width = piexlRect.sw + 1;
	const height = piexlRect.sh + 1;
	// 瓦片剪裁并缩放
	const demArray = arrayclipAndResize(
		demData.array,
		demData.width,
		piexlRect.sx,
		piexlRect.sy,
		piexlRect.sw,
		piexlRect.sh,
		width,
		height
	);
	return { array: demArray, width, height };
}

function getBoundsCoord(clipBounds: [number, number, number, number], targetSize: number) {
	// left-top coordinate
	const sx = Math.floor(clipBounds[0] * targetSize);
	const sy = Math.floor(clipBounds[1] * targetSize);
	// width and height of the clipped image
	const sw = Math.floor((clipBounds[2] - clipBounds[0]) * targetSize);
	const sh = Math.floor((clipBounds[3] - clipBounds[1]) * targetSize);
	return { sx, sy, sw, sh };
}
