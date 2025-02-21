import { Martini } from "./Martini";
import { AttributesType, addSkirt } from "../../geometry";

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
	const { vertices, triangles } = tile.getMesh(maxError);

	// 取得属性
	const attributes = getMeshAttributes(dem, vertices, triangles);

	// 添加裙边
	const mesh = addSkirt(attributes, triangles, 1);

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

	// From Martini demo
	// https://observablehq.com/@mourner/martin-real-time-rtin-terrain-mesh
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
function getMeshAttributes(
	terrain: Float32Array,
	vertices: Uint16Array,
	indices: Uint16Array | Uint32Array,
): AttributesType {
	const gridSize = Math.floor(Math.sqrt(terrain.length));
	const tileSize = gridSize - 1;
	const numOfVerticies = vertices.length / 2;

	// vec3. x, y in pixels, z in meters
	const positions = new Float32Array(numOfVerticies * 3);

	// vec2. 1 to 1 relationship with position. represents the uv on the texture image. 0,0 to 1,1.
	const texCoords = new Float32Array(numOfVerticies * 2);

	// 转换顶点坐标到-0.5到0.5之间，计算纹理坐标0-1之间
	for (let i = 0; i < numOfVerticies; i++) {
		const x = vertices[i * 2];
		const y = vertices[i * 2 + 1];
		const pixelIdx = y * gridSize + x;

		positions[3 * i + 0] = x / tileSize - 0.5;
		positions[3 * i + 1] = 0.5 - y / tileSize;
		positions[3 * i + 2] = terrain[pixelIdx];

		texCoords[2 * i + 0] = x / tileSize;
		texCoords[2 * i + 1] = 1 - y / tileSize;
	}

	const normals = getNormals(positions, indices);

	return {
		position: { value: positions, size: 3 },
		texcoord: { value: texCoords, size: 2 },
		normal: { value: normals, size: 3 },
	};
}

/**
 * 计算法向量
 * @param vertices
 * @param indices
 * @param skirtIndex
 * @returns
 */
function getNormals(vertices: Float32Array, indices: Uint16Array | Uint32Array): Float32Array {
	// 每个顶点一个法向量
	const normals = new Float32Array(vertices.length);
	// 遍历三角形索引，每次处理三个索引（一个三角形）
	for (let i = 0; i < indices.length; i += 3) {
		const i0 = indices[i] * 3;
		const i1 = indices[i + 1] * 3;
		const i2 = indices[i + 2] * 3;
		// 获取三角形的三个顶点
		const v0 = [vertices[i0], vertices[i0 + 1], vertices[i0 + 2]];
		const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
		const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
		// 计算两个边向量
		const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
		const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
		// 计算法向量（叉积）
		const normal = [
			edge1[1] * edge2[2] - edge1[2] * edge2[1],
			edge1[2] * edge2[0] - edge1[0] * edge2[2],
			edge1[0] * edge2[1] - edge1[1] * edge2[0],
		];
		// 归一化法向量
		const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
		if (length > 0) {
			normal[0] /= length;
			normal[1] /= length;
			normal[2] /= length;
		}
		// console.assert(Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2])>0.99, 'Noramls error');

		// 将法向量加到每个顶点的法向量上
		normals[i0] += normal[0];
		normals[i0 + 1] += normal[1];
		normals[i0 + 2] += normal[2];

		normals[i1] += normal[0];
		normals[i1 + 1] += normal[1];
		normals[i1 + 2] += normal[2];

		normals[i2] += normal[0];
		normals[i2 + 1] += normal[1];
		normals[i2 + 2] += normal[2];
	}

	return normals;
}
