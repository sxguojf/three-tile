import { Color, ColorRepresentation } from "three";
import { TileMaterialLoader } from "three-tile";
import { ContourShader } from "./ContourShader";

export class ContourLoader extends TileMaterialLoader {
	public dataType = "contour";
	public constructor(color: ColorRepresentation = new Color(0xff0000), interval: number = 100, width: number = 1) {
		super();
		this.material = new ContourShader({ interval, width, color });
	}
}
