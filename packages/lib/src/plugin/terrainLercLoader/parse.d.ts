/**
 *@description: ArcGis-lerc data parser
 *@author: 郭江峰
 *@date: 2023-04-05
 */
export type DEMType = {
    demArray: Float32Array;
    width: number;
    height: number;
};
export declare function parse(data: DEMType, z: number, clipBounds: [number, number, number, number]): import("../../geometry").GeometryDataType;
