/**
 *@description: 一些几何体数据生成工具函数
 *@author: Guojf
 *@date: 2023-04-06
 */

import { GeometryDataType } from "./GeometryDataTypes";
import { addSkirt } from "./skirt";

/**
 * 根据DEM数组计算瓦片gemetry的顶点、UV、法向量和三角形索引
 * @param dem - DEM
 * @param skirt - 是否加裙边
 * @returns - 顶点、UV、法向量和索引
 */
export function getGeometryInfoFromDem(dem: Float32Array, skirt: boolean = true): GeometryDataType {
	const size = Math.floor(Math.sqrt(dem.length));
	const width = size;
	const height = size;

	// 计算三角形索引
	const indices = getIndices(height, width);
	// 计算顶点、UV和法向量
	const attributes = getAttributes(dem, height, width, indices);

	// // 构建Martin
	// const martini = new Martini(gridSize);
	// // 简化
	// const tile = martini.createTile(dem);
	// // 几何误差
	// const maxError = maxErrors[z] / 1000 || 0;
	// // 取得顶点和索引
	// const { vertices, triangles } = tile.getMesh(maxError);
	// // 取得属性
	// const attributes = getMeshAttributes(vertices, dem);

	// 添加裙边
	const mesh = skirt ? addSkirt(attributes, indices, 0.3) : { attributes, indices };

	return mesh;
}

/**
 * 根据DEM数组计算顶点和UV
 * @param dem DEM array
 * @param height
 * @param width
 * @returns Vertices and UV
 */
function getAttributes(dem: Float32Array, height: number, width: number, indices: Uint16Array | Uint32Array) {
	const numVertices = width * height;
	const vertices = new Float32Array(numVertices * 3);
	const uvs = new Float32Array(numVertices * 2);
	let index = 0;
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			// Vert
			vertices[index * 3] = x / (width - 1) - 0.5;
			vertices[index * 3 + 1] = y / (height - 1) - 0.5;
			vertices[index * 3 + 2] = dem[(height - y - 1) * width + x];

			// UV
			uvs[index * 2] = vertices[index * 3] + 0.5;
			uvs[index * 2 + 1] = vertices[index * 3 + 1] + 0.5;

			index++;
		}
	}
	return {
		position: { value: vertices, size: 3 },
		texcoord: { value: uvs, size: 2 },
		normal: { value: getNormals(vertices, indices), size: 3 },
	};
}

/**
 * 计算三角形索引
 * @param height
 * @param width
 * @returns
 */
function getIndices(height: number, width: number) {
	const numIndices = 6 * (width - 1) * (height - 1);
	const indices = new Uint16Array(numIndices);

	let index = 0;
	for (let y = 0; y < height - 1; y++) {
		for (let x = 0; x < width - 1; x++) {
			// 矩形四个顶点索引
			const a = y * width + x;
			const b = a + 1;
			const c = a + width;
			const d = c + 1;

			// 每个矩形两个三角形
			indices[index * 6] = a;
			indices[index * 6 + 1] = b;
			indices[index * 6 + 2] = c;

			indices[index * 6 + 3] = c;
			indices[index * 6 + 4] = b;
			indices[index * 6 + 5] = d;

			index++;
		}
	}
	return indices;
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
