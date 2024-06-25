/**
 *@description: image material loader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Material, MeshLambertMaterial } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";
import { ITileMaterialLoader } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";
import { TileTextureLoader } from "./TileTextureLoader";
import { TileMaterial } from "../material";

/**
 * image material loader
 */
class TileMaterialImageLoader implements ITileMaterialLoader {
	public readonly dataType: string = "image";

	public load(source: ISource, tile: Tile, onLoad: () => void, onError: (err: any) => void): Material {
		// dispose texture on material disposed
		const onMaterialDispose = (evt: { target: MeshLambertMaterial }) => {
			const mat = evt.target;
			if (mat.map?.image instanceof ImageBitmap) {
				mat.map.image.close();
			}
			mat.map?.dispose();
			mat.removeEventListener("dispose", onMaterialDispose);
		};

		const material = this.createMaterial();
		material.opacity = source.opacity;

		material.addEventListener("dispose", onMaterialDispose);

		const textureLoader = new TileTextureLoader();
		const texture = textureLoader.load(
			source,
			tile,
			() => {
				material.map = texture;
				texture.needsUpdate = true;
				onLoad();
			},
			(err) => {
				onError(err);
			},
		);

		return material;
	}

	public createMaterial() {
		return new TileMaterial();
	}
}

LoaderFactory.registerMaterialLoader(new TileMaterialImageLoader());
