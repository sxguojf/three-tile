import { TileSource } from "three-tile";
import { DEMType } from "./parse";

export class TifDemSource extends TileSource {
	public dataType = "tif-dem";
	public data?: DEMType;
}
