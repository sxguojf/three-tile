import { TileSource } from "../tt";

export class SingleImageSource extends TileSource {
	public dataType = "image";
	public image?: HTMLImageElement;
}
