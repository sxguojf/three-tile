export type DEMType = {
    buffer: Float32Array;
    width: number;
    height: number;
};
/**
 * 解析 DEM 数据
 * @param data 包含 DEM 数据的对象，包含 buffer、width 和 height 属性
 * @param sourceBounds 原始数据的边界范围 [xMin, yMin, xMax, yMax]
 * @param clipBounds 需要提取的区域的边界范围 [xMin, yMin, xMax, yMax]
 * @param targetWidth 目标数据的宽度，默认为 64
 * @param targetHeight 目标数据的高度，默认为 64
 * @returns 提取并缩放后的 Float32Array 数据
 */
export declare function parse(data: DEMType, sourceBounds: [number, number, number, number], clipBounds: [number, number, number, number], targetWidth?: number, targetHeight?: number): Float32Array;
