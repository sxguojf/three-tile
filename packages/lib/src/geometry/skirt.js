/**
 *@description: Add skirt to geometry
 *@author: 郭江峰
 *@date: 2025-02-20
 *https://github.com/visgl/loaders.gl/blob/master/modules/terrain/src/lib/helpers/skirt.ts
 */
export function concatenateTypedArrays(...typedArrays) {
    const arrays = typedArrays;
    const TypedArrayConstructor = (arrays && arrays.length > 1 && arrays[0].constructor) || null;
    if (!TypedArrayConstructor) {
        throw new Error("concatenateTypedArrays - incorrect quantity of arguments or arguments have incompatible data types");
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
/**
 * Add skirt to existing mesh
 * @param attributes - POSITION and TEXCOOD_0 attributes data
 * @param  triangles - indices array of the mesh geometry
 * @param  skirtHeight - height of the skirt geometry
 * @param  outsideIndices - edge indices from quantized mesh data
 * @returns - geometry data with added skirt
 */
export function addSkirt(attributes, triangles, skirtHeight, outsideIndices) {
    const outsideEdges = outsideIndices
        ? getOutsideEdgesFromIndices(outsideIndices, attributes.position.value)
        : getOutsideEdgesFromTriangles(triangles);
    const edgeCount = outsideEdges.length;
    const newPosition = new Float32Array(edgeCount * 6);
    const newTexcoord0 = new Float32Array(edgeCount * 4);
    const newTriangles = new triangles.constructor(edgeCount * 6);
    const newNormals = new Float32Array(edgeCount * 6);
    for (let i = 0; i < edgeCount; i++) {
        updateAttributesForNewEdge({
            edge: outsideEdges[i],
            edgeIndex: i,
            attributes,
            skirtHeight,
            newPosition,
            newTexcoord0,
            newTriangles,
            newNormals,
        });
    }
    attributes.position.value = concatenateTypedArrays(attributes.position.value, newPosition);
    attributes.texcoord.value = concatenateTypedArrays(attributes.texcoord.value, newTexcoord0);
    attributes.normal.value = concatenateTypedArrays(attributes.normal.value, newNormals);
    const resultTriangles = concatenateTypedArrays(triangles, newTriangles);
    return {
        attributes,
        indices: resultTriangles,
    };
}
/**
 * Get geometry edges that located on a border of the mesh
 * @param {Uint16Array | Uint32Array | number[]} triangles - indices array of the mesh geometry
 * @returns {number[][]} - outside edges data
 */
function getOutsideEdgesFromTriangles(triangles) {
    // 存储边的数组
    const edges = [];
    // 将输入转换为数组形式
    const triArray = Array.isArray(triangles) ? triangles : Array.from(triangles);
    // 遍历每个三角形
    for (let i = 0; i < triArray.length; i += 3) {
        const a = triArray[i];
        const b = triArray[i + 1];
        const c = triArray[i + 2];
        // 将每条边添加到edges数组中
        edges.push([a, b], [b, c], [c, a]);
    }
    // 对边进行排序
    edges.sort(([a1, b1], [a2, b2]) => {
        const minA = Math.min(a1, b1);
        const minB = Math.min(a2, b2);
        return minA !== minB ? minA - minB : Math.max(a1, b1) - Math.max(a2, b2);
    });
    // 存储外部边的数组
    const outsideEdges = [];
    // 遍历排序后的边数组
    for (let i = 0; i < edges.length; i++) {
        // 如果当前边与下一条边是相邻的，则跳过下一条边
        if (i + 1 < edges.length && edges[i][0] === edges[i + 1][1] && edges[i][1] === edges[i + 1][0]) {
            i++;
        }
        else {
            // 否则，将当前边添加到外部边数组中
            outsideEdges.push(edges[i]);
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
function getOutsideEdgesFromIndices(indices, position) {
    // 定义排序函数
    const sortIndices = (array, compareFn) => {
        array.sort(compareFn);
    };
    // 对西边边界的索引按 y 坐标排序
    sortIndices(indices.westIndices, (a, b) => position[3 * a + 1] - position[3 * b + 1]);
    // 对东边边界的索引按 y 坐标降序排序
    sortIndices(indices.eastIndices, (a, b) => position[3 * b + 1] - position[3 * a + 1]);
    // 对南边边界的索引按 x 坐标排序
    sortIndices(indices.southIndices, (a, b) => position[3 * b] - position[3 * a]);
    // 对北边边界的索引按 x 坐标降序排序
    sortIndices(indices.northIndices, (a, b) => position[3 * a] - position[3 * b]);
    // 用于存储边缘的数组
    const edges = [];
    // 遍历索引对象的值
    Object.values(indices).forEach(indexGroup => {
        // 如果索引组长度大于1
        if (indexGroup.length > 1) {
            // 遍历索引组，除了最后一个索引
            for (let i = 0; i < indexGroup.length - 1; i++) {
                // 将相邻索引组成边缘，并添加到边缘数组中
                edges.push([indexGroup[i], indexGroup[i + 1]]);
            }
        }
    });
    return edges;
}
/**
 * Get geometry edges that located on a border of the mesh
 * @param {UpdateAttributesArgs} args
 * @returns {void}
 */
function updateAttributesForNewEdge({ edge, edgeIndex, attributes, skirtHeight, newPosition, newTexcoord0, newTriangles, newNormals, }) {
    const positionsLength = attributes.position.value.length;
    const vertex1Offset = edgeIndex * 2;
    const vertex2Offset = vertex1Offset + 1;
    // 增加2个裙边顶点坐标
    newPosition.set(attributes.position.value.subarray(edge[0] * 3, edge[0] * 3 + 3), vertex1Offset * 3); // 复制三个顶点坐标
    newPosition[vertex1Offset * 3 + 2] = newPosition[vertex1Offset * 3 + 2] - skirtHeight; // 修改裙边高度
    newPosition.set(attributes.position.value.subarray(edge[1] * 3, edge[1] * 3 + 3), vertex2Offset * 3);
    newPosition[vertex2Offset * 3 + 2] = newPosition[vertex2Offset * 3 + 2] - skirtHeight; // 修改裙边高度
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
    // 添加2个三角形法向量（6个顶点）
    newNormals[triangle1Offset] = 0;
    newNormals[triangle1Offset + 1] = 0;
    newNormals[triangle1Offset + 2] = 1;
    newNormals[triangle1Offset + 3] = 0;
    newNormals[triangle1Offset + 4] = 0;
    newNormals[triangle1Offset + 5] = 1;
}
