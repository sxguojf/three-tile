import { TileSource } from "../../source/TileSource";

export class SingleImageSource extends TileSource {
	public dataType = "image";
	public image?: HTMLImageElement;
}
