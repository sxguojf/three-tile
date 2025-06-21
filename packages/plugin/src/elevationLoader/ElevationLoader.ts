import { TileMaterialLoader } from "three-tile";
import { ElevationShader } from "./ElevationShader";

export class ElevationLoader extends TileMaterialLoader {
	public dataType = "elevation";

	public constructor(minHeight: number = 0, maxHeight: number = 3000) {
		super();
		this.material = new ElevationShader(minHeight, maxHeight);
	}
	public get maxHeight(): number {
		return (this.material as ElevationShader).maxHeight;
	}
	public set maxHeight(value: number) {
		(this.material as ElevationShader).maxHeight = value;
	}

	public get minHeight(): number {
		return (this.material as ElevationShader).minHeight;
	}

	public set minHeight(value: number) {
		(this.material as ElevationShader).minHeight = value;
	}
}
