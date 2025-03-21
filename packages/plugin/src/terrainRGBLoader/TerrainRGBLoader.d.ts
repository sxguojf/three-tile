/**
 *@description: Mapbox-RGB geometry loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { BufferGeometry } from "three";
import { TileSourceLoadParamsType, TileGeometryLoader } from "../../loader";
/**
 * Mapbox-RGB geometry loader
 */
export declare class TerrainRGBLoader extends TileGeometryLoader {
    readonly info: {
        version: string;
        description: string;
    };
    readonly dataType = "terrain-rgb";
    private imageLoader;
    private _workerPool;
    constructor();
    /**
     * 异步加载BufferGeometry对象
     *
     * @param url 图片的URL地址
     * @param params 加载参数，包含瓦片xyz和裁剪边界clipBounds
     * @returns 返回解析后的BufferGeometry对象
     */
    protected doLoad(url: string, params: TileSourceLoadParamsType): Promise<BufferGeometry>;
}
