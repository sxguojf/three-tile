/**
 *@description: Single-image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { Material } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from "../../loader";
import { SingleImageSource } from "./singleImageSource";
/**
 * Single image Material loader
 */
export declare class SingleImageLoader implements ITileMaterialLoader {
    readonly info: {
        version: string;
        description: string;
    };
    readonly dataType: string;
    private _imageLoader;
    /**
     * 加载材质
     * @param source 数据源
     * @param tile 瓦片
     * @returns 材质
     */
    load(params: TileSourceLoadParamsType<SingleImageSource>): Promise<Material>;
    private _setTexture;
    private _getTileTexture;
}
