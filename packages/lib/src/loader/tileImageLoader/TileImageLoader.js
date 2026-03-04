/**
 *@description: Plugin of image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { ImageLoader, SRGBColorSpace, Texture } from "three";
import { LoaderFactory, TileMaterialLoader, getSubImage } from "..";
import { version } from "../..";
/**
 * Tile image loader
 */
export class TileImageLoader extends TileMaterialLoader {
    constructor() {
        super(...arguments);
        this.info = {
            version,
            description: "Tile image loader. It can load xyz tile image.",
        };
        this.dataType = "image";
        this.loader = new ImageLoader(LoaderFactory.manager);
    }
    /**
     * 加载瓦片图像作为纹理
     *
     * @param url 图像资源的URL
     * @param params 加载参数，包括x, y, z坐标、投影范围，裁剪边界clipBounds
     * @returns 返回一个Promise对象，解析为HTMLImageElement类型。
     */
    async doLoad(url, params) {
        let img = await this.loader.loadAsync(url);
        // 当瓦片级别大于数据源的最大级别时，从父瓦片中剪裁图像
        const clipBounds = params.clipBounds;
        // 剪裁宽度<1
        if (clipBounds[2] - clipBounds[0] < 1) {
            img = getSubImage(img, clipBounds);
        }
        const texture = new Texture(img);
        texture.colorSpace = SRGBColorSpace;
        return texture;
    }
}
