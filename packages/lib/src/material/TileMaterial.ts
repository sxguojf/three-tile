/**
 *@description: Tile marterila
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FrontSide, Material, MeshLambertMaterial, MeshLambertMaterialParameters, Texture } from "three";

/**
 * 瓦片材质接口
 */
export interface ITileMaterial extends Material {
	map?: Texture | null;
}

/**
 * 瓦片材质
 */
export class TileMaterial extends MeshLambertMaterial {
	constructor(params: MeshLambertMaterialParameters = {}) {
		super({ ...{ transparent: true, side: FrontSide }, ...params });
	}
}
