import { ImageLoader, MeshBasicMaterial, Texture } from "three";
import { ImageLoaderEx, ITileMaterialLoader, LoaderFactory } from "../../loader";
import { SourceWithProjection } from "../../map/SourceWithProjection";
import { ISource } from "../../source";

/**
 * LOGO tile Material loader
 */
export class SingleImageLoader implements ITileMaterialLoader {
	public readonly dataType: string = "single-image";
	// private _texture: CanvasTexture | null = null; // = new CanvasTexture(this.drawLogo(source.attribution));
	// private _texture: Texture | null = null;
	private _image?: HTMLImageElement;
	private _imageLoader = new ImageLoader(LoaderFactory.manager); //new ImageLoaderEx(LoaderFactory.manager);

	/**
	 * 加载材质
	 * @param source 数据源
	 * @param tile 瓦片
	 * @param onLoad 加载完成回调
	 * @returns 材质
	 */
	public load(source: ISource, x: number, y: number, z: number, onLoad: () => void): MeshBasicMaterial {
		if (z < source.minLevel || z > source.maxLevel) {
			setTimeout(onLoad);
			return new MeshBasicMaterial();
		}

		const material = new MeshBasicMaterial({
			transparent: true,
			opacity: source.opacity,
		});
		material.addEventListener("dispose", () => {
			if (material.map) {
				material.map.dispose();
			}
		});

		if (this._image) {
			const texture = this.getTileTexture(source, x, y, z);
			if (!this._image?.complete) {
				console.log("image is incomplete");
			}
			material.map = texture;
			texture.needsUpdate = true;
			setTimeout(onLoad);
		} else {
			const tileUrl = source.getTileUrl(0, 0, 0);
			if (tileUrl) {
				//this._image = this.imageLoader.load(tileUrl || "", () => {});
				this._image = this._imageLoader.load(tileUrl, () => {
					if (!this._image?.complete) {
						console.log("image is incomplete");
					}
					const texture = this.getTileTexture(source, x, y, z);
					material.map = texture;
					texture.needsUpdate = true;
					onLoad();
				});
			}
		}

		// this.loadImage(source);

		// 截取并绘制瓦片
		// if (!this._texture) {
		// 	this._texture = new CanvasTexture(this.drawLogo(source.attribution));
		// 	this._texture.needsUpdate = true;
		// }

		// setTimeout(onLoad, 1000);

		return material;
	}

	// public loadImage(source: ISource) {
	// 	if (this._image) return this._image;
	// 	const tileUrl = source.getTileUrl(0, 0, 0) || "";
	// 	//this._image = this.imageLoader.load(tileUrl || "", () => {});
	// 	this._image = this._imageLoader.load(tileUrl);
	// 	return this._image;
	// }

	public getTileTexture(source: ISource, x: number, y: number, z: number): Texture {
		// const size = 256;
		// const canvas = new OffscreenCanvas(size, size);
		// const ctx = canvas.getContext("2d")!;
		// if (ctx) {
		// 	const tileUrl = source.getTileUrl(x, y, z);
		// 	if (tileUrl) {
		// 		return fetch(tileUrl)
		// 			.then((res) => res.blob())
		// 			.then((blob) => createImageBitmap(blob));
		// 	}
		// }

		const sourceProj = source as SourceWithProjection;

		const newx = sourceProj.projection.getTileXWithCenterLon(x, z);
		const imageBounds = sourceProj._projectionBounds; // 图像投影坐标范围
		const tileBounds = sourceProj.projection.getTileBounds(newx, y, z); // 瓦片投影坐标范围

		const tileUrl = source.getTileUrl(newx, y, z);

		if (
			tileBounds[2] < imageBounds[0] || // minx
			tileBounds[3] < imageBounds[1] || // miny
			tileBounds[0] > imageBounds[2] || // maxx
			tileBounds[1] > imageBounds[3] // maxy
		) {
			return new Texture(new Image(1, 1));
		}

		return new Texture(this._image);

		// const tileUrl = source.getTileUrl(x, y, z);
		// if (tileUrl) {
		// 	return this._texture!;
		// } else {
		// 	return new Texture();
		// }
	}
}
