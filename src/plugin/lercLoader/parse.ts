import { addSkirt } from "../../geometry";
import { Martini } from "../../geometry/Martini";

export type DEMType = {
	demArray: Float32Array;
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
		const bounds = clipBounds.map((bound) => bound + 0.5) as [number, number, number, number];
		demData = getSubDEM(data, bounds);
	}

	const { demArray, width: gridSize } = demData;

	// 构建Martin
	const martini = new Martini(gridSize);
	// 简化
	const tile = martini.createTile(demArray);
	// 几何误差
	const maxError = maxErrors[z] / 1000 || 0;
	// 取得Geometry数据
	const geoData = tile.getGeometryData(maxError);
	// 添加裙边
	const mesh = addSkirt(geoData.attributes, geoData.indices, 1);
	return mesh;
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
		dh: number,
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

	function rect2ImageBounds(clipBounds: [number, number, number, number], imgSize: number) {
		// left-top coordinate
		const sx = Math.floor(clipBounds[0] * imgSize);
		const sy = Math.floor(clipBounds[1] * imgSize);
		// width and height of the clipped image
		const sw = Math.floor((clipBounds[2] - clipBounds[0]) * imgSize);
		const sh = Math.floor((clipBounds[3] - clipBounds[1]) * imgSize);
		return { sx, sy, sw, sh };
	}

	const piexlRect = rect2ImageBounds(bounds, demData.width);
	// Martini需要瓦片大小为n*2+1
	const width = piexlRect.sw + 1;
	const height = piexlRect.sh + 1;
	// 瓦片剪裁并缩放
	const demArray = arrayclipAndResize(
		demData.demArray,
		demData.width,
		piexlRect.sx,
		piexlRect.sy,
		piexlRect.sw,
		piexlRect.sh,
		width,
		height,
	);
	return { demArray, width, height };
}
