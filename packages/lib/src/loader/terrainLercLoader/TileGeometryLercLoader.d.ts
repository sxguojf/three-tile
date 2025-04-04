/**
 *@description: ArcGis-lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { TileGeometry } from "../../geometry/TileGeometry";
import { TileGeometryLoader, TileSourceLoadParamsType } from "../../loader";
/**
 * ArcGis-lerc格式瓦片几何体加载器
 * @link https://github.com/Esri/lerc
 */
export declare class TileGeometryLercLoader extends TileGeometryLoader {
    readonly info: {
        version: string;
        description: string;
    };
    readonly dataType = "lerc";
    private fileLoader;
    private _workerPool;
    constructor();
    /**
     * 解码给定缓冲区中的Lerc数据
     *
     * @param buffer Lerc编码数据的ArrayBuffer
     * @returns 解码后的高度图数据、宽度和高度的对象
     */
    private decode;
    /**
     * 异步加载并解析数据，返回BufferGeometry对象
     *
     * @param url 数据文件的URL
     * @param params 解析参数，包含瓦片xyz和裁剪边界clipBounds
     * @returns 返回解析后的BufferGeometry对象
     */
    protected doLoad(url: string, params: TileSourceLoadParamsType): Promise<TileGeometry>;
}
