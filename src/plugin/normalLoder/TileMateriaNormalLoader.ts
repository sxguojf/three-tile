/**
 *@description: Tile normal loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Material, MeshNormalMaterial } from "three";
import { ISource, ITileMaterialLoader } from "../..";

/**
 * Tile normal Material loader
 */
export class TileMateriaNormalLoader implements ITileMaterialLoader {
	public readonly dataType: string = "normal";
	public discription = "Tile normal material loader.";

	public async load(source: ISource, _x: number, _y: number, _z: number): Promise<Material> {
		const material = new MeshNormalMaterial({
			// transparent: true,
			opacity: source.opacity,
			flatShading: true,
		});
		return material;
	}
}
