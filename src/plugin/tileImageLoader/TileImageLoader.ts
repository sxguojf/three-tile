import { ImageLoader, SRGBColorSpace, Texture } from "three";
import { getBoundsCoord, LoaderFactory, TileSourceLoadParamsType, TileMaterialLoader } from "../../loader";

/**
 * Tile image loader
 */
export class TileImageLoader extends TileMaterialLoader {
	public readonly info = {
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
		const img = await this.loader.loadAsync(url);
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

/**
 * get sub image in rect from source image
 * @param image source image
 * @bounds  rect (orgin is (0,0), range is (-1,1))
 * @returns sub image
 */
function getSubImage(image: HTMLImageElement, bounds: [number, number, number, number]) {
	const size = image.width;
	const canvas = new OffscreenCanvas(size, size);
	const ctx = canvas.getContext("2d")!;
	const { sx, sy, sw, sh } = getBoundsCoord(bounds, image.width);
	ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size);
	return canvas;
}
