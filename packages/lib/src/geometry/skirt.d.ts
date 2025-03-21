/**
 *@description: Add skirt to geometry
 *@author: 郭江峰
 *@date: 2025-02-20
 *https://github.com/visgl/loaders.gl/blob/master/modules/terrain/src/lib/helpers/skirt.ts
 */
import { AttributesType, GeometryDataType } from "./GeometryDataTypes";
export declare function concatenateTypedArrays<T>(...typedArrays: T[]): T;
export type EdgeIndices = {
    westIndices: Uint16Array | Uint32Array;
    southIndices: Uint16Array | Uint32Array;
    eastIndices: Uint16Array | Uint32Array;
    northIndices: Uint16Array | Uint32Array;
};
/**
 * Add skirt to existing mesh
 * @param attributes - POSITION and TEXCOOD_0 attributes data
 * @param  triangles - indices array of the mesh geometry
 * @param  skirtHeight - height of the skirt geometry
 * @param  outsideIndices - edge indices from quantized mesh data
 * @returns - geometry data with added skirt
 */
export declare function addSkirt(attributes: AttributesType, triangles: Uint16Array | Uint32Array, skirtHeight: number, outsideIndices?: EdgeIndices): GeometryDataType;
