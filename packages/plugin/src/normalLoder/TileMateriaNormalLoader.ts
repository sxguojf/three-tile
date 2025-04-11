/**
 *@description: Tile normal loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { ITileMaterialLoader, TileSourceLoadParamsType } from "three-tile";
import { Material, MeshNormalMaterial } from "three";

/**
 * Tile normal Material loader
 */
export class TileMateriaNormalLoader implements ITileMaterialLoader {
	public readonly info = {
		version: "0.10.0",
		description: "Tile normal material loader.",
	};
	public readonly dataType: string = "normal";

	public async load(params: TileSourceLoadParamsType): Promise<Material> {
		const material = new MeshNormalMaterial({
			// transparent: true,
			opacity: params.source.opacity,
			flatShading: true,
		});
		return material;
	}
}
