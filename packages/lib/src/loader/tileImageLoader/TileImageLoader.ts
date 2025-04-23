/**
 *@description: Plugin of image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { ImageLoader, SRGBColorSpace, Texture } from "three";
import { LoaderFactory, TileMaterialLoader, TileSourceLoadParamsType, getSubImage } from "..";

/**
 * Tile image loader
 */
export class TileImageLoader extends TileMaterialLoader {
	public readonly info = {
		version: "0.10.0",
		description: "Tile image loader. It can load xyz tile image.",
	};

	public dataType = "image";

	private loader = new ImageLoader(LoaderFactory.manager);

	/**
	 * 加载图像资源的方法
	 *
	 * @param url 图像资源的URL
	 * @param params 加载参数，包括x, y, z坐标和裁剪边界clipBounds
	 * @returns 返回一个Promise对象，解析为HTMLImageElement类型。
	 */
	protected async doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture> {
		const img = await this.loader.loadAsync(url).catch(_err => {
			return new Image(1, 1);
		});
		const texture = new Texture();
		texture.colorSpace = SRGBColorSpace;
		const { bounds: clipBounds } = params;
		// 是否需要剪裁
		if (clipBounds[2] - clipBounds[0] < 1) {
			texture.image = getSubImage(img, clipBounds);
		} else {
			texture.image = img;
		}
		texture.needsUpdate = true;
		return texture;
	}
}
