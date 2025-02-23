/**
 *@description: Image material loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Material } from "three";
import { ITileMaterialLoader } from "../../loader/ITileLoaders";
import { TileTextureLoader } from "../../loader/TileTextureLoader";
import { TileMaterial } from "../../material";
import { ISource } from "../../source";

/**
 * Image tile material loader
 */
export class TileImageLoader implements ITileMaterialLoader {
	public readonly dataType: string = "image";

	public load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): Material {
		const material = new TileMaterial();
		material.opacity = source.opacity;
		const textureLoader = new TileTextureLoader();
		const texture = textureLoader.load(
			source,
			x,
			y,
			z,
			() => {
				material.setTexture(texture);
				onLoad();
			},
			onLoad,
			abortSignal,
		);

		return material;
	}
}
