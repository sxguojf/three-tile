import { ITileMaterial, TileMaterialLoader } from "three-tile";
import { ElevationShader as ElevationShader } from "./ElevationShader";

export class ElevationLoader extends TileMaterialLoader {
	public dataType = "eleator";
	public get material(): ITileMaterial {
		return new ElevationShader(0, 3000);
	}
}
