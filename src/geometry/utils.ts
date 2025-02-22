/**
 *@description: 一些几何体数据生成工具函数
 *@author: Guojf
 *@date: 2023-04-06
 */

import { AttributesType, GeometryDataType } from "./GeometryDataTypes";
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
	const indices = getGridIndices(height, width);
	// 计算顶点坐标、UV坐标和法向量
	const attributes = getAttributes(dem, height, width);

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
	if (skirt) {
		return addSkirt(attributes, indices, 1);
	} else {
		return { attributes, indices };
	}
}

/**
 * 根据DEM数组计算顶点和UV
 * @param dem DEM array
 * @param height
 * @param width
 * @returns Vertices and UV
 */
function getAttributes(dem: Float32Array, height: number, width: number): AttributesType {
	const numVertices = width * height;
	// 创建顶点数组
	const vertices = new Float32Array(numVertices * 3);
	// 创建UV坐标数组
	const uvs = new Float32Array(numVertices * 2);
	let index = 0;
	// 遍历高度和宽度
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			// 归一化坐标
			const xNorm = x / (width - 1);
			const yNorm = y / (height - 1);
			// 设置UV坐标
			uvs[index * 2] = xNorm;
			uvs[index * 2 + 1] = yNorm;
			// 设置顶点位置
			vertices[index * 3] = xNorm - 0.5;
			vertices[index * 3 + 1] = yNorm - 0.5;
			vertices[index * 3 + 2] = dem[(height - y - 1) * width + x];

			index++;
		}
	}
	return {
		// 顶点位置属性
		position: { value: vertices, size: 3 },
		// UV坐标属性
		texcoord: { value: uvs, size: 2 },
		// 法线属性
		normal: { value: getNormals(vertices, getGridIndices(height, width)), size: 3 },
	};
}

/**
 * 获取网格索引数组
 *
 * @param height 高度
 * @param width 宽度
 * @returns 网格索引数组
 */
export function getGridIndices(height: number, width: number) {
	const numIndices = 6 * (width - 1) * (height - 1);
	const indices = new Uint16Array(numIndices);

	let index = 0;
	for (let y = 0; y < height - 1; y++) {
		for (let x = 0; x < width - 1; x++) {
			const a = y * width + x;
			const b = a + 1;
			const c = a + width;
			const d = c + 1;

			const baseIndex = index * 6;
			indices[baseIndex] = a;
			indices[baseIndex + 1] = b;
			indices[baseIndex + 2] = c;
			indices[baseIndex + 3] = c;
			indices[baseIndex + 4] = b;
			indices[baseIndex + 5] = d;

			index++;
		}
	}
	return indices;
}

/**
 * 根据顶点、索引计算法向量
 * @param vertices
 * @param indices
 * @param skirtIndex
 * @returns
 */
export function getNormals(vertices: Float32Array, indices: Uint16Array | Uint32Array): Float32Array {
	// 初始化一个和顶点数组相同长度的法线数组
	const normals = new Float32Array(vertices.length);

	// 遍历索引数组
	for (let i = 0; i < indices.length; i += 3) {
		// 获取三个顶点的索引并转换为对应的顶点索引位置
		const i0 = indices[i] * 3;
		const i1 = indices[i + 1] * 3;
		const i2 = indices[i + 2] * 3;

		// 获取三个顶点的坐标
		const v0x = vertices[i0];
		const v0y = vertices[i0 + 1];
		const v0z = vertices[i0 + 2];

		const v1x = vertices[i1];
		const v1y = vertices[i1 + 1];
		const v1z = vertices[i1 + 2];

		const v2x = vertices[i2];
		const v2y = vertices[i2 + 1];
		const v2z = vertices[i2 + 2];

		// 计算两个边向量
		const edge1x = v1x - v0x;
		const edge1y = v1y - v0y;
		const edge1z = v1z - v0z;

		const edge2x = v2x - v0x;
		const edge2y = v2y - v0y;
		const edge2z = v2z - v0z;

		// 使用叉乘计算法向量
		const normalX = edge1y * edge2z - edge1z * edge2y;
		const normalY = edge1z * edge2x - edge1x * edge2z;
		const normalZ = edge1x * edge2y - edge1y * edge2x;

		// 计算法向量的长度
		const length = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
		const ns = [0, 0, 1];
		if (length > 0) {
			// 归一化法向量
			const invLength = 1 / length;
			ns[0] = normalX * invLength;
			ns[1] = normalY * invLength;
			ns[2] = normalZ * invLength;
		}
		for (let i = 0; i < 3; i++) {
			normals[i0 + i] = normals[i1 + i] = normals[i2 + i] = ns[i];
		}
	}
	return normals;
}
