/**
 *@description: Tile normal loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { ITileMaterial, ITileMaterialLoader, TileSourceLoadParamsType, version } from "three-tile";
import { Material, MeshNormalMaterial } from "three";

/**
 * Tile normal Material loader
 */
export class TileMateriaNormalLoader implements ITileMaterialLoader {
	public readonly info = {
		version,
		description: "Tile normal material loader.",
	};
	public readonly dataType: string = "normal";

	public async load(params: TileSourceLoadParamsType): Promise<Material> {
		const material = new MeshNormalMaterial({
			transparent: params.source.transparent,
			opacity: params.source.opacity,
			flatShading: true,
		});

		const dispose = (evt: { target: ITileMaterial }) => {
			evt.target.map?.dispose();
			material.removeEventListener("dispose", dispose);
		};
		material.addEventListener("dispose", dispose);

		material.addEventListener("dispose", dispose);

		return material;
	}
}
