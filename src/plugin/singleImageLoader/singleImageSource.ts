import { TileSource } from "../../source";

export class SingleImageSource extends TileSource {
	public dataType = "image";
	public image?: HTMLImageElement;
}
