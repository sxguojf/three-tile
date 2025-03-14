/**
 *@description: Single-image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { ImageLoader, Material, SRGBColorSpace, Texture } from "three";
import { ITileMaterialLoader, LoaderFactory } from "../../loader";
import { TileMaterial } from "../../material";
import { ISource } from "../../source";

/**
 * Single image Material loader
 */
export class SingleImageLoader implements ITileMaterialLoader {
	public readonly dataType: string = "single-image";
	public discription = "Single image loader. It can load an picture and Stick to the ground.";

	private _image?: HTMLImageElement | undefined;

	private _imageLoader = new ImageLoader(LoaderFactory.manager);

	/**
	 * 加载材质
	 * @param source 数据源
	 * @param tile 瓦片
	 * @returns 材质
	 */
	public async load(
		source: ISource,
		_x: number,
		_y: number,
		z: number,
		tileBounds: [number, number, number, number],
	): Promise<Material> {
		const material = new TileMaterial({
			transparent: true,
			opacity: source.opacity,
		});

		const url = source.getUrl(0, 0, 0);

		// 请求的瓦片不在数据源范围内或没有url，直接返回材质
		if (z < source.minLevel || z > source.maxLevel || !url) {
			return material;
		}

		// 如果图片已加载，则设置纹理后返回材质
		if (this._image?.complete) {
			this._setTexture(material, source, tileBounds);
			return material;
		}

		// 加载纹理
		this._image = await this._imageLoader.loadAsync(url);
		this._setTexture(material, source, tileBounds);
		return material;
	}

	private _setTexture(material: TileMaterial, source: ISource, tileBounds: [number, number, number, number]) {
		const texture = this._getTileTexture(source, tileBounds);
		// material.map = texture;
		material.setTexture(texture);
		texture.needsUpdate = true;
	}

	private _getTileTexture(source: ISource, tileBounds: [number, number, number, number]): Texture {
		const sourceProj = source;
		const tileSize = 256;
		const canvas = new OffscreenCanvas(tileSize, tileSize);

		if (this._image) {
			const ctx = canvas.getContext("2d")!;
			const imageBounds = sourceProj._projectionBounds; // 图像投影坐标范围
			// const tileBounds = sourceProj._getTileBounds(x, y, z); // 瓦片投影坐标范围

			// if (sourceProj._tileInBounds(x, y, z)) {
			const sizeX = this._image?.width || 256;
			const sizeY = this._image?.height || 256;

			const scaleX = (imageBounds[2] - imageBounds[0]) / sizeX;
			const scaleY = (imageBounds[3] - imageBounds[1]) / sizeY;

			const sx = (tileBounds[0] - imageBounds[0]) / scaleX;
			const sy = (imageBounds[3] - tileBounds[3]) / scaleY;

			const swidth = (tileBounds[2] - tileBounds[0]) / scaleX;
			const sheight = (tileBounds[3] - tileBounds[1]) / scaleY;

			ctx.drawImage(this._image, sx, sy, swidth, sheight, 0, 0, tileSize, tileSize);
		}

		const texture = new Texture(canvas);
		texture.colorSpace = SRGBColorSpace;
		return texture;
	}
}
