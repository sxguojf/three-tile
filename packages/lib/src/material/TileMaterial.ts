/**
 *@description: Tile marterila
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FrontSide, MeshLambertMaterial, MeshLambertMaterialParameters } from "three";

/**
 * Tile material
 */
export class TileMaterial extends MeshLambertMaterial {
	constructor(params: MeshLambertMaterialParameters = {}) {
		super({ ...{ transparent: true, side: FrontSide }, ...params });
	}

	public dispose(): void {
		const texture = this.map;
		if (texture) {
			if (texture.image instanceof ImageBitmap) {
				texture.image.close();
			}
			texture.dispose();
		}
	}
}
