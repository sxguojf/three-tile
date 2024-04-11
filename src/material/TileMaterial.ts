/**
 *@description: tile material, not used. Multiple textures are currently used instead.
 *@author: Guojf
 *@date: 2023-04-06
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
export class TileMaterial extends ShaderMaterial {
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
