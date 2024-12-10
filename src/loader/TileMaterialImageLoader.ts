/**
 *@description: Image material loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Material } from "three";
import { TileMaterial } from "../material";
import { ISource } from "../source";
import { Tile } from "../tile";
import { ITileMaterialLoader } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";
import { TileTextureLoader } from "./TileTextureLoader";

/**
 * image material loader
 */
class TileMaterialImageLoader implements ITileMaterialLoader {
	public readonly dataType: string = "image";

	public load(source: ISource, tile: Tile, onLoad: () => void): Material {
		const material = this.createMaterial();
		material.opacity = source.opacity;
		const textureLoader = new TileTextureLoader();
		const texture = textureLoader.load(
			source,
			tile,
			() => {
				material.map = texture;
				texture.needsUpdate = true;
				onLoad();
			},
			onLoad,
		);

		return material;
	}

	public createMaterial() {
		return new TileMaterial();
	}
}

LoaderFactory.registerMaterialLoader(new TileMaterialImageLoader());
