/**
 *@description: Plugin of image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { ImageLoader, LinearFilter, SRGBColorSpace, Texture } from "three";
import { LoaderFactory, TileLoadClipParamsType, TileMaterialLoader, getSubImage } from "..";
import { version } from "../..";

/**
 * Tile image loader
 */
export class TileImageLoader extends TileMaterialLoader {
	public readonly info = {
		version,
		description: "Tile image loader. It can load xyz tile image.",
	};

	public dataType = "image";

	private loader = new ImageLoader(LoaderFactory.manager);

	/**
	 * 加载瓦片图像作为纹理
	 *
	 * @param url 图像资源的URL
	 * @param params 加载参数，包括x, y, z坐标、投影范围，裁剪边界clipBounds
	 * @returns 返回一个Promise对象，解析为HTMLImageElement类型。
	 */
	protected async doLoad(url: string, params: TileLoadClipParamsType): Promise<Texture> {
		const img = await this.loader.loadAsync(url);
		const texture = new Texture();
		texture.colorSpace = SRGBColorSpace;
		texture.image = img;
		const clipBounds = params.clipBounds;
		// 从父瓦片中剪裁
		if (clipBounds[2] - clipBounds[0] < 1) {
			texture.image = getSubImage(img, clipBounds);
		}
		// texture.generateMipmaps = false;
		// texture.minFilter = LinearFilter;
		// texture.anisotropy = 1;
		return texture;
	}
}
