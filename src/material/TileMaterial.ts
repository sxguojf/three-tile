import { FrontSide, MeshLambertMaterial, MeshLambertMaterialParameters } from "three";

export class TileMaterial extends MeshLambertMaterial {
	constructor(params: MeshLambertMaterialParameters = { transparent: true, side: FrontSide }) {
		super(params);
	}
}
