/**
 *@description: tile material, not used. Multiple textures are currently used instead.
 *@author: Guojf
 *@date: 2023-04-06
 */

/**
 * 瓦片材质（放弃）
 *
 * TileMaterial使用自定义着色器实现地图材质
 * 1、使用自定义着色器根据影像图数据实现多个瓦片纹理的混合
 *    因着色器中难以传入动态属性，也就是影像瓦片层数不能运行时修改，只能预设固定层数，故放弃
 * 2、使用Canvas根据影像图数据实现多个瓦片纹理的混合
 *    Canvas绘制效率相对更灵活，可以随心所欲绘制纹理，但理论上效率略低（肉测无影响），故放弃
 * 3、使用自定义着色器根据高程数据拉伸Z坐标实现高度
 *    用着色器实现地形渲染效率非常高，但不好解决瓦片接缝问题，另外射线法取高程也无法实现，故放弃
 *
 * 目前瓦片材质直接使用了MeshLambertMaterial，影像叠加按使用多重纹理实现。
 *
 */

import { Color, ShaderLib, ShaderMaterial, Texture, UniformsUtils } from "three";
import frag from "./shader/tile.frag1.glsl?raw";
import vert from "./shader/tile.vert.glsl?raw";

export interface TileMaterialParameters {
	map?: Texture | null | undefined;
	map1?: Texture | null | undefined;
	transparent?: boolean;
	wireframe?: boolean;
	diffuse?: Color;
}

/**
 * Tile shade, include multiple textures and pixel to Z
 */
export class TileShaderMaterial extends ShaderMaterial {
	public constructor(parameters: TileMaterialParameters) {
		super({
			uniforms: UniformsUtils.merge([
				ShaderLib.lambert.uniforms,
				{
					map1: { value: null },
					diffuse: { value: new Color(0xffffff) },
				},
			]),
			vertexShader: vert,
			fragmentShader: frag,
			lights: true,
			transparent: parameters.transparent || true,
			wireframe: parameters.wireframe || false,
			fog: true,
		});

		this.uniforms.map.value = parameters.map;
		this.uniforms.map1.value = parameters.map1;

		this.defineProperty("map1");
		this.defineProperty("diffuse");
		this.defineProperty("opacity");
	}

	public dispose(): void {
		this.uniforms.map.value?.dispose();
		this.uniforms.map1.value?.dispose();
		super.dispose();
	}

	defineProperty(propertyName: string) {
		Object.defineProperty(this, propertyName, {
			get: function () {
				return this.uniforms[propertyName].value;
			},
			set: function (value) {
				this.uniforms[propertyName].value = value;
			},
		});
	}
}
