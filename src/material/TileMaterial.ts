import { FrontSide, MeshStandardMaterial, MeshStandardMaterialParameters } from "three";

export class TileMaterial extends MeshStandardMaterial {
	// constructor(params: MeshLambertMaterialParameters = { transparent: true, side: FrontSide }) {
	// 	super(params);
	// }
	constructor(params: MeshStandardMaterialParameters = { transparent: true, side: FrontSide }) {
		super(params);
	}
}
