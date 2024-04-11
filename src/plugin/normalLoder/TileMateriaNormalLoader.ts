import { MeshNormalMaterial } from "three";
import { ISource, ITileMaterialLoader, Tile } from "../..";

/**
 * Tile normal Material loader
 */
export class TileMateriaNormalLoader implements ITileMaterialLoader {
	public readonly dataType: string = "normal";

	public load(source: ISource, _tile: Tile, onLoad: () => void, _onError: (err: any) => void): MeshNormalMaterial {
		const material = new MeshNormalMaterial({
			transparent: true,
			opacity: source.opacity,
			flatShading: true,
		});
		setTimeout(onLoad);
		return material;
	}
}
