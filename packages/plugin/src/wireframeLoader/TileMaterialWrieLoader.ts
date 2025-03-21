/**
 *@description: Wireframe material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Color, Material, MeshBasicMaterial } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from "../tt";

/**
 * Wireframe material loader
 */
export class TileMaterialWrieLoader implements ITileMaterialLoader {
	public readonly info = {
		version: "0.10.0",
		description: "Tile wireframe material loader.",
	};

	public readonly dataType: string = "wireframe";

	public async load(params: TileSourceLoadParamsType): Promise<Material> {
		const color = new Color(`hsl(${params.z * 14}, 100%, 50%)`);
		const material = new MeshBasicMaterial({
			transparent: true,
			wireframe: true,
			color,
			opacity: params.source.opacity,
			depthTest: false,
		});
		return material;
	}
}
