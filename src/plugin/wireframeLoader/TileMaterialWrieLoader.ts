import { Color, Material, MeshBasicMaterial } from "three";
import { ISource } from "../../source";
import { ITileMaterialLoader } from "../../loader";
import { Tile } from "../../tile";

/**
 * Wireframe material loader
 */
export class TileMaterialWrieLoader implements ITileMaterialLoader {
	public readonly dataType: string = "wireframe";

	public load(source: ISource, tile: Tile, onLoad: () => void): Material {
		const color = new Color(`hsl(${tile.z * 14}, 100%, 50%)`);
		const material = new MeshBasicMaterial({
			transparent: true,
			wireframe: true,
			color,
			opacity: source.opacity,
		});
		setTimeout(onLoad);
		return material;
	}
}
