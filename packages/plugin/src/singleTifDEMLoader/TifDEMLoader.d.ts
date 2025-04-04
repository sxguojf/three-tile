/**
 *@description: TIF DEM terrain loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { BufferGeometry } from "three";
import { ITileGeometryLoader, TileSourceLoadParamsType } from "three-tile";
import { TifDemSource } from "./TifDEMSource";
/**
 * TIF DEM terrain loader
 */
export declare class TifDEMLoder implements ITileGeometryLoader {
    readonly info: {
        version: string;
        description: string;
    };
    readonly dataType: string;
    private _loader;
    /**
     * 构造函数，初始化 TifDEMLoder 实例
     */
    constructor();
    /**
     * 加载瓦片的几何体数据
     * @param params 包含加载瓦片所需的参数，类型为 TileSourceLoadParamsType<TifDemSource>
     * @returns 加载完成后返回一个 BufferGeometry 对象
     */
    load(params: TileSourceLoadParamsType<TifDemSource>): Promise<BufferGeometry>;
    /**
     * 从 ArrayBuffer 中读取 TIFF 图像的栅格数据
     * @param buffer 包含 TIFF 图像数据的 ArrayBuffer
     * @returns 包含栅格数据的对象，包含 buffer、width 和 height 属性
     */
    private getTIFFRaster;
    /**
     * 获取指定瓦片的数字高程模型（DEM）数据
     * @param raster 包含DEM数据的对象，具有buffer、width和height属性
     * @param sourceProjBbox 原始数据的投影边界框，格式为 [xMin, yMin, xMax, yMax]
     * @param tileBounds 瓦片的边界框，格式为 [xMin, yMin, xMax, yMax]
     * @param targetSize 目标数据的大小，用于指定输出数据的宽度和高度
     * @returns 经过处理后的DEM数据数组，除以1000得到km单位高程
     */
    private getTileDEM;
}
