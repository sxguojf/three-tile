// 给瓦片加上裙边

// https://github.com/visgl/loaders.gl/blob/master/modules/terrain/src/lib/helpers/skirt.ts

export function concatenateTypedArrays<T>(...typedArrays: T[]): T {
	// @ts-ignore
	const arrays = typedArrays as TypedArray[];
	const TypedArrayConstructor = (arrays && arrays.length > 1 && arrays[0].constructor) || null;
	if (!TypedArrayConstructor) {
		throw new Error(
			'"concatenateTypedArrays" - incorrect quantity of arguments or arguments have incompatible data types',
		);
	}

	const sumLength = arrays.reduce((acc, value) => acc + value.length, 0);
	const result = new TypedArrayConstructor(sumLength);
	let offset = 0;
	for (const array of arrays) {
		result.set(array, offset);
		offset += array.length;
	}
	return result;
}

export type EdgeIndices = {
	westIndices: Uint16Array | Uint32Array;
	southIndices: Uint16Array | Uint32Array;
	eastIndices: Uint16Array | Uint32Array;
	northIndices: Uint16Array | Uint32Array;
};

export type GeometryAttributes = {
	position: { value: Float32Array; size: number };
	texcoord: { value: Float32Array; size: number };
};

/**
 * Add skirt to existing mesh
 * @param {GeometryAttributes} attributes - POSITION and TEXCOOD_0 attributes data
 * @param {Uint16Array | Uint32Array} triangles - indices array of the mesh geometry
 * @param {number} skirtHeight - height of the skirt geometry
 * @param {EdgeIndices} [outsideIndices] - edge indices from quantized mesh data
 * @returns - geometry data with added skirt
 */
export function addSkirt(
	attributes: GeometryAttributes,
	triangles: Uint16Array | Uint32Array,
	skirtHeight: number,
	outsideIndices?: EdgeIndices,
) {
	// 如果传入边缘边顶点索引，从边缘顶点计算边缘边，否则根据顶点坐标计算边缘边
	const outsideEdges = outsideIndices
		? getOutsideEdgesFromIndices(outsideIndices, attributes.position.value)
		: getOutsideEdgesFromTriangles(triangles);

	// 边缘边顶点坐标
	const newPosition = new Float32Array(outsideEdges.length * 6);
	// 边缘边纹理坐标
	const newTexcoord0 = new Float32Array(outsideEdges.length * 4);
	// 边缘三角形
	const newTriangles = new (triangles instanceof Uint32Array ? Uint32Array : Uint16Array)(outsideEdges.length * 6);

	for (let i = 0; i < outsideEdges.length; i++) {
		const edge = outsideEdges[i];

		updateAttributesForNewEdge({
			edge,
			edgeIndex: i,
			attributes,
			skirtHeight,
			newPosition,
			newTexcoord0,
			newTriangles,
		});
	}

	// 边缘顶点坐标、纹理坐标、三角形合并到原有属性
	attributes.position.value = concatenateTypedArrays(attributes.position.value, newPosition);
	attributes.texcoord.value = concatenateTypedArrays(attributes.texcoord.value, newTexcoord0);
	const resultTriangles = concatenateTypedArrays(triangles, newTriangles);

	return {
		attributes,
		triangles: resultTriangles,
	};
}

/**
 * Get geometry edges that located on a border of the mesh
 * @param {Uint16Array | Uint32Array | number[]} triangles - indices array of the mesh geometry
 * @returns {number[][]} - outside edges data
 */
function getOutsideEdgesFromTriangles(triangles: Uint16Array | Uint32Array | number[]): number[][] {
	// 取出所有的三角形
	const edges: number[][] = [];
	for (let i = 0; i < triangles.length; i += 3) {
		const a = triangles[i];
		const b = triangles[i + 1];
		const c = triangles[i + 2];

		edges.push([a, b]); // 第1条边
		edges.push([b, c]); // 第2条边
		edges.push([c, a]); // 第3条边
	}

	// 三角形按顶点坐标排序
	edges.sort((a, b) => Math.min(...a) - Math.min(...b) || Math.max(...a) - Math.max(...b));

	// 取出所有在边缘的三角形
	const outsideEdges: number[][] = [];
	let index = 0;
	while (index < edges.length - 1) {
		// 取出相邻两条边
		const a = edges[index][0]; // 第1条边的起点
		const b = edges[index][1]; // 第1条边的终点
		const c = edges[index + 1][1]; // 第2条边的终点
		const d = edges[index + 1][0]; // 第2条边的起点
		// 如果相邻两个三角形有共用边，那么不是边缘边，否则是边缘边
		if (a === c && b === d) {
			index += 2;
		} else {
			// 是边缘边，三角形加入数组
			outsideEdges.push(edges[index]);
			index++;
		}
	}
	return outsideEdges;
}

/**
 * Get geometry edges that located on a border of the mesh
 * @param {EdgeIndices} indices - edge indices from quantized mesh data
 * @param {Float32Array} position - position attribute geometry data
 * @returns {number[][]} - outside edges data
 */
function getOutsideEdgesFromIndices(indices: EdgeIndices, position: Float32Array): number[][] {
	// Sort skirt indices to create adjacent triangles
	indices.westIndices.sort((a, b) => position[3 * a + 1] - position[3 * b + 1]);
	// Reverse (b - a) to match triangle winding
	indices.eastIndices.sort((a, b) => position[3 * b + 1] - position[3 * a + 1]);
	indices.southIndices.sort((a, b) => position[3 * b] - position[3 * a]);
	// Reverse (b - a) to match triangle winding
	indices.northIndices.sort((a, b) => position[3 * a] - position[3 * b]);

	const edges: number[][] = [];
	for (const index in indices) {
		const indexGroup = indices[index as keyof EdgeIndices];
		for (let i = 0; i < indexGroup.length - 1; i++) {
			edges.push([indexGroup[i], indexGroup[i + 1]]);
		}
	}
	return edges;
}

type UpdateAttributesArgs = {
	edge: number[];
	edgeIndex: number;
	attributes: GeometryAttributes;
	skirtHeight: number;
	newPosition: Float32Array;
	newTexcoord0: Float32Array;
	newTriangles: Uint16Array | Uint32Array | number[];
};

/**
 * Get geometry edges that located on a border of the mesh
 * @param {UpdateAttributesArgs} args
 * @returns {void}
 */
function updateAttributesForNewEdge({
	edge,
	edgeIndex,
	attributes,
	skirtHeight,
	newPosition,
	newTexcoord0,
	newTriangles,
}: UpdateAttributesArgs): void {
	const positionsLength = attributes.position.value.length;
	const vertex1Offset = edgeIndex * 2;
	const vertex2Offset = vertex1Offset + 1;

	// 增加2个裙边顶点坐标
	newPosition.set(attributes.position.value.subarray(edge[0] * 3, edge[0] * 3 + 3), vertex1Offset * 3); // 复制三个顶点坐标
	newPosition[vertex1Offset * 3 + 2] = newPosition[vertex1Offset * 3 + 2] - skirtHeight; // 修改裙边高度
	newPosition.set(attributes.position.value.subarray(edge[1] * 3, edge[1] * 3 + 3), vertex2Offset * 3);
	newPosition[vertex2Offset * 3 + 2] = newPosition[vertex2Offset * 3 + 2] - skirtHeight; // put down elevation on the skirt height

	// 增加2个裙边纹理坐标
	newTexcoord0.set(attributes.texcoord.value.subarray(edge[0] * 2, edge[0] * 2 + 2), vertex1Offset * 2);
	newTexcoord0.set(attributes.texcoord.value.subarray(edge[1] * 2, edge[1] * 2 + 2), vertex2Offset * 2);

	// 增加2个裙边三角形（6个顶点）
	const triangle1Offset = edgeIndex * 2 * 3;
	newTriangles[triangle1Offset] = edge[0];
	newTriangles[triangle1Offset + 1] = positionsLength / 3 + vertex2Offset;
	newTriangles[triangle1Offset + 2] = edge[1];

	newTriangles[triangle1Offset + 3] = positionsLength / 3 + vertex2Offset;
	newTriangles[triangle1Offset + 4] = edge[0];
	newTriangles[triangle1Offset + 5] = positionsLength / 3 + vertex1Offset;
}
