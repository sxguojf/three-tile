import { ImageLoader, Material, ShaderMaterial, Texture } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType, getSafeTileUrlAndBounds } from "../../../loader";
import { ISource } from "../../../source";
import fs from "./frag.glsl?raw";
import vs from "./vert.glsl?raw";

/**
 * 自定义shader影像瓦片加载器
 * image material loader
 */
export class ShaderMaterialTileLoader implements ITileMaterialLoader {
	public readonly dataType: string = "shaderImage";
	public readonly info = {
		version: "0.10.0",
		description: "shaderImage，使用ShaderMaterial，通过着色器设置材质",
	};
	private _imageLoader = new ImageLoader();

	/**
	 *
	 *
	 * @param {TileSourceLoadParamsType} params  加载参数，包括x, y, z坐标和裁剪边界clipBounds
	 * @return {*}  {Promise<Material>}
	 */
	public async load(params: TileSourceLoadParamsType): Promise<Material> {
		const { source, x, y, z } = params;
		const material = this.createMaterial(source);
		material.opacity = source.opacity;
		// get max level tile and bounds
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (!url) {
			return material;
		}
		// const texture = await this._textureLoader.load(source, x, y, z);
		// source.userData.image = texture.image;
		const img = await this._imageLoader.loadAsync(url);
		const texture = new Texture(img);
		material.uniforms.u_texture = { value: texture }; //材质纹理贴图
		// LoaderFactory.manager.parseEnd(url);
		return material;
	}

	public createMaterial(source: ISource) {
		const g_tileSource = source;

		const material = new ShaderMaterial({
			uniforms: {
				brightness: { value: g_tileSource.brightness || 0.5 },
				contrast: { value: g_tileSource.contrast || 0.5 },
				hue: { value: g_tileSource.hue || 0.5 },
				saturation: { value: g_tileSource.saturation || 0.5 },
			},
			vertexShader: vs,
			fragmentShader: fs,
		});
		return material;
	}
}
