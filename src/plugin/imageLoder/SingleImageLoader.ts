import { ImageLoader, Material, MeshBasicMaterial, MeshLambertMaterial, SRGBColorSpace, Texture } from "three";
import { ITileMaterialLoader, LoaderFactory } from "../../loader";
import { ISource } from "../../source";

/**
 * Single image Material loader
 */
export class SingleImageLoader implements ITileMaterialLoader {
	public readonly dataType: string = "single-image";
	private _image?: HTMLImageElement;
	private _imageLoader = new ImageLoader(LoaderFactory.manager);
	private _isLoading = false;

	/**
	 * 加载材质
	 * @param source 数据源
	 * @param tile 瓦片
	 * @param onLoad 加载完成回调
	 * @returns 材质
	 */
	public load(source: ISource, x: number, y: number, z: number, onLoad: () => void): Material {
		if (z < source.minLevel || z > source.maxLevel) {
			setTimeout(onLoad);
			return new MeshBasicMaterial();
		}

		const material = new MeshLambertMaterial({
			transparent: true,
			opacity: source.opacity,
		});
		material.addEventListener("dispose", () => {
			if (material.map) {
				material.map.dispose();
			}
		});

		if (this._image && this._image.complete) {
			this._setTexture(material, source, x, y, z);
			setTimeout(onLoad);
		} else {
			const tileUrl = source._getTileUrl(0, 0, 0);
			if (tileUrl) {
				if (this._isLoading) {
					const timer = setInterval(() => {
						if (this._image && this._image.complete) {
							this._setTexture(material, source, x, y, z);
							onLoad();
							clearInterval(timer);
						}
					}, 100);
				} else {
					this.loadImage(tileUrl, () => {
						this._setTexture(material, source, x, y, z);
						onLoad();
					});
				}
			}
		}

		return material;
	}

	private loadImage(url: string, onLoad: () => void) {
		this._isLoading = true;
		this._image = this._imageLoader.load(url, () => {
			this._isLoading = false;
			onLoad();
		});
	}

	private _setTexture(material: MeshLambertMaterial, source: ISource, x: number, y: number, z: number) {
		const texture = this._getTileTexture(source, x, y, z);
		material.map = texture;
		texture.needsUpdate = true;
	}

	private _getTileTexture(source: ISource, x: number, y: number, z: number): Texture {
		const sourceProj = source;

		const imageBounds = sourceProj._projectionBounds; // 图像投影坐标范围
		const tileBounds = sourceProj._getTileBounds(x, y, z); // 瓦片投影坐标范围

		// if (sourceProj._tileInBounds(x, y, z)) {
		const sizeX = this._image!.width;
		const sizeY = this._image!.height;

		const scaleX = (imageBounds[2] - imageBounds[0]) / sizeX;
		const scaleY = (imageBounds[3] - imageBounds[1]) / sizeY;

		const sx = (tileBounds[0] - imageBounds[0]) / scaleX;
		const sy = (imageBounds[3] - tileBounds[3]) / scaleY;

		const swidth = (tileBounds[2] - tileBounds[0]) / scaleX;
		const sheight = (tileBounds[3] - tileBounds[1]) / scaleY;

		const tileSize = 256;
		const canvas = new OffscreenCanvas(tileSize, tileSize);
		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(this._image!, sx, sy, swidth, sheight, 0, 0, tileSize, tileSize);

		const texture = new Texture(canvas);
		texture.colorSpace = SRGBColorSpace;
		return texture;
	}
}
