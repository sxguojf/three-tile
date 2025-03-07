import { SRGBColorSpace, Texture } from "three";
import { getBoundsCoord, ImageLoaderEx, LoaderFactory, TileMaterialLoader } from "../../loader";

/**
 * Tile image loader
 */
export class TileImageLoader extends TileMaterialLoader<HTMLImageElement> {
	public dataType = "image";
	public discription = "Tile image loader. It can load xyz tile image.";

	private loader = new ImageLoaderEx(LoaderFactory.manager);

	/**
	 * 加载图像资源的方法
	 *
	 * @param url 图像资源的URL
	 * @param abortSignal 中断信号，用于取消加载操作
	 * @returns 返回一个Promise对象，解析为HTMLImageElement类型。
	 */
	protected doLoad(url: string, abortSignal: AbortSignal): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			this.loader.load(url, resolve, undefined, reject, abortSignal);
		});
	}

	/**
	 * 解析传入的HTMLImageElement元素，并将其转换为Texture对象。
	 *
	 * @param buffer 传入的HTMLImageElement元素。
	 * @param _x x坐标参数。
	 * @param _y y坐标参数。
	 * @param _z z坐标参数。
	 * @param clipBounds 裁剪边界数组，格式为[left, top, right, bottom]。
	 * @returns 返回一个Promise对象，解析为Texture类型。
	 */
	protected doPrase(
		buffer: HTMLImageElement,
		_x: number,
		_y: number,
		_z: number,
		clipBounds: [number, number, number, number],
	): Promise<Texture> {
		const texture = new Texture();
		texture.colorSpace = SRGBColorSpace;
		// 是否需要剪裁
		if (clipBounds[2] - clipBounds[0] < 1) {
			texture.image = getSubImageFromRect(buffer, clipBounds);
		} else {
			texture.image = buffer;
		}
		texture.needsUpdate = true;
		return Promise.resolve(texture);
	}
}

/**
 * get sub image in rect from source image
 * @param image source image
 * @bounds  rect (orgin is (0,0), range is (-1,1))
 * @returns sub image
 */
function getSubImageFromRect(image: HTMLImageElement, bounds: [number, number, number, number]) {
	const size = image.width;
	const canvas = new OffscreenCanvas(size, size);
	const ctx = canvas.getContext("2d")!;
	const { sx, sy, sw, sh } = getBoundsCoord(bounds, image.width);
	ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size);
	return canvas;
}
