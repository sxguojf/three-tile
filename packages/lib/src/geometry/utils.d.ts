/**
 *@description: utils of geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { GeometryDataType } from "./GeometryDataTypes";
/**
 * 根据DEM数组计算瓦片gemetry的顶点、UV、法向量和三角形索引
 * @param dem - DEM
 * @param skirt - 是否加裙边
 * @returns - 顶点、UV、法向量和索引
 */
export declare function getGeometryDataFromDem(dem: Float32Array, skirt?: boolean): GeometryDataType;
/**
 * 获取网格索引数组
 *
 * @param height 高度
 * @param width 宽度
 * @returns 网格索引数组
 */
export declare function getGridIndices(height: number, width: number): Uint16Array<ArrayBuffer>;
/**
 * 根据顶点、索引计算法向量
 * @param vertices
 * @param indices
 * @param skirtIndex
 * @returns
 */
export declare function getNormals(vertices: Float32Array, indices: Uint16Array | Uint32Array): Float32Array;
