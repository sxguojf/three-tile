/**
 *@description: Single-image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { ImageLoader, Material, SRGBColorSpace, Texture } from "three";
import { SingleImageSource } from "./SingleImageSource";
import { ISource, ITileMaterialLoader, LoaderFactory, TileMaterial, TileSourceLoadParamsType } from "three-tile";

/**
 * Single image Material loader
 */
export class SingleImageLoader implements ITileMaterialLoader {
	public readonly info = {
		version: "0.10.0",
		description: "Single image loader. It can load single image to bounds and stick to the ground.",
	};

	public readonly dataType: string = "single-image";

	// private _image?: HTMLImageElement | undefined;

	private _imageLoader = new ImageLoader(LoaderFactory.manager);

	/**
	 * 加载材质
	 * @param source 数据源
	 * @param tile 瓦片
	 * @returns 材质
	 */
	public async load(params: TileSourceLoadParamsType<SingleImageSource>): Promise<Material> {
		const { source, bounds, z } = params;

		const material = new TileMaterial({
			transparent: true,
			opacity: source.opacity,
		});

		const url = source._getUrl(0, 0, 0);

		// 请求的瓦片不在数据源范围内或没有url，直接返回材质
		if (z < source.minLevel || z > source.maxLevel || !url) {
			return material;
		}

		// const image = source.image; // .userData.image;

		// 如果图片已加载，则设置纹理后返回材质
		if (source._image?.complete) {
			this._setTexture(material, source._image, source, bounds);
			return material;
		}

		console.log("loadi image...", url);

		// 加载纹理
		source._image = await this._imageLoader.loadAsync(url);
		this._setTexture(material, source._image, source, bounds);
		return material;
	}

	private _setTexture(
		material: TileMaterial,
		image: HTMLImageElement,
		source: ISource,
		tileBounds: [number, number, number, number]
	) {
		const texture = this._getTileTexture(image, source, tileBounds);
		material.setTexture(texture);
		texture.needsUpdate = true;
	}

	private _getTileTexture(
		image: HTMLImageElement,
		source: ISource,
		tileBounds: [number, number, number, number]
	): Texture {
		const sourceProj = source;
		const tileSize = 256;
		const canvas = new OffscreenCanvas(tileSize, tileSize);

		if (image) {
			const ctx = canvas.getContext("2d")!;
			const imageBounds = sourceProj._projectionBounds; // 图像投影坐标范围

			const width = image.width;
			const height = image.height;

			const scaleX = (imageBounds[2] - imageBounds[0]) / width;
			const scaleY = (imageBounds[3] - imageBounds[1]) / height;

			const sx = (tileBounds[0] - imageBounds[0]) / scaleX;
			const sy = (imageBounds[3] - tileBounds[3]) / scaleY;

			const swidth = (tileBounds[2] - tileBounds[0]) / scaleX;
			const sheight = (tileBounds[3] - tileBounds[1]) / scaleY;

			ctx.drawImage(image, sx, sy, swidth, sheight, 0, 0, tileSize, tileSize);
		}

		const texture = new Texture(canvas);
		texture.colorSpace = SRGBColorSpace;
		return texture;
	}
}
