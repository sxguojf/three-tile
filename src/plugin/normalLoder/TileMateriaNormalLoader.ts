import { MeshNormalMaterial } from "three";
import { ISource, ITileMaterialLoader } from "../..";

/**
 * Tile normal Material loader
 */
export class TileMateriaNormalLoader implements ITileMaterialLoader {
	public readonly dataType: string = "normal";

	public load(source: ISource, _x: number, _y: number, _z: number, onLoad: () => void): MeshNormalMaterial {
		const material = new MeshNormalMaterial({
			// transparent: true,
			opacity: source.opacity,
			flatShading: true,
		});
		onLoad();
		return material;
	}
}
