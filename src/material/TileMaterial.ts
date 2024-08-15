import { FrontSide, MeshStandardMaterial, MeshStandardMaterialParameters } from "three";

/**
 * Tile material
 */
export class TileMaterial extends MeshStandardMaterial {
	constructor(params: MeshStandardMaterialParameters = { transparent: true, side: FrontSide }) {
		super(params);
	}
}
