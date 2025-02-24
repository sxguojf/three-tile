// https://observablehq.com/@mourner/martin-real-time-rtin-terrain-mesh

import { AttributesType, addSkirt, getNormals } from "../../geometry";
import { Martini } from "../../geometry/Martini";

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

/**
 * 解析高程数据并生成网格模型
 *
 * @param imgData 高程影像
 * @param z 缩放级别
 * @returns 包含顶点索引和属性的对象
 */
export function parse(imgData: ImageData, z: number) {
	const dem = getTerrain(imgData);
	// 计算网格大小
	const gridSize = Math.floor(Math.sqrt(dem.length));

	// 构建Martin
	const martini = new Martini(gridSize);
	// 简化
	const tile = martini.createTile(dem);
	// 几何误差
	const maxError = maxErrors[z] / 1000 || 0;
	// 取得顶点和索引
	const geoDta = tile.getGeometryData(maxError);
	// 添加裙边
	const mesh = addSkirt(geoDta.attributes, geoDta.indices, 1);

	return mesh;
}

/**
 * Get terrain points from image data.
 *
 * @param data - Terrain data encoded as image.
 * @returns The terrain elevation as a Float32 array.
 */
function getTerrain(imageData: ImageData): Float32Array {
	const data = imageData.data;
	const tileSize = imageData.width;
	const gridSize = tileSize + 1;

	const terrain = new Float32Array(gridSize * gridSize);

	// Decode terrain values
	for (let i = 0, y = 0; y < tileSize; y++) {
		for (let x = 0; x < tileSize; x++, i++) {
			// 透明像素直接返回高度0
			if (data[i * 4 + 3] === 0) {
				terrain[i + y] = 0;
			}
			const k = i * 4;
			const r = data[k + 0];
			const g = data[k + 1];
			const b = data[k + 2];

			const rgb = (r << 16) | (g << 8) | b;
			terrain[i + y] = rgb / 10000 - 10;
		}
	}

	// Backfill bottom border
	for (let i = gridSize * (gridSize - 1), x = 0; x < gridSize - 1; x++, i++) {
		terrain[i] = terrain[i - gridSize];
	}

	// Backfill right border
	for (let i = gridSize - 1, y = 0; y < gridSize; y++, i += gridSize) {
		terrain[i] = terrain[i - 1];
	}
	return terrain;
}
