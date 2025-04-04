/**
 *@description: Plugin of image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { Texture } from "three";
import { TileMaterialLoader, TileSourceLoadParamsType } from "../../loader";
/**
 * Tile image loader
 */
export declare class TileImageLoader extends TileMaterialLoader {
    readonly info: {
        version: string;
        description: string;
    };
    dataType: string;
    private loader;
    /**
     * 加载图像资源的方法
     *
     * @param url 图像资源的URL
     * @param params 加载参数，包括x, y, z坐标和裁剪边界clipBounds
     * @returns 返回一个Promise对象，解析为HTMLImageElement类型。
     */
    protected doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
}
