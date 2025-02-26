/**
 *@description: Wireframe material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Color, Material, MeshBasicMaterial } from "three";
import { ITileMaterialLoader } from "../../loader";
import { ISource } from "../../source";

/**
 * Wireframe material loader
 */
export class TileMaterialWrieLoader implements ITileMaterialLoader {
	public readonly dataType: string = "wireframe";

	public load(source: ISource, _x: number, _y: number, z: number, onLoad: () => void): Material {
		const color = new Color(`hsl(${z * 14}, 100%, 50%)`);
		const material = new MeshBasicMaterial({
			transparent: true,
			wireframe: true,
			color,
			opacity: source.opacity,
			depthTest: false,
		});
		onLoad();
		return material;
	}
}
