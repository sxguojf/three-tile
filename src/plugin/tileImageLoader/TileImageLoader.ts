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
 * image material loader
 */
export class TileImageLoader implements ITileMaterialLoader {
	public readonly dataType: string = "image";
	public useWorker = false;

	public load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): Material {
		const material = this.createMaterial();
		material.opacity = source.opacity;
		const textureLoader = new TileTextureLoader();
		const texture = textureLoader.load(
			source,
			x,
			y,
			z,
			() => {
				material.map = texture;
				texture.needsUpdate = true;
				onLoad();
			},
			onLoad,
			abortSignal,
		);

		return material;
	}

	public createMaterial() {
		return new TileMaterial();
	}
}
