/**
 *@description: Tile marterila
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FrontSide, Material, MeshLambertMaterialParameters, MeshStandardMaterial, Texture } from "three";

/**
 * 瓦片材质接口
 */
export interface ITileMaterial extends Material {
	map?: Texture | null;
}

/**
 * 瓦片材质
 */
export class TileMaterial extends MeshStandardMaterial {
	constructor(params: MeshLambertMaterialParameters = {}) {
		super({ ...{ transparent: false, side: FrontSide }, ...params });
		// this.onBeforeCompile = shader => {
		// 	console.log(shader.vertexShader);
		// 	console.log("==============================");
		// 	console.log(shader.fragmentShader);
		// };
	}
}
