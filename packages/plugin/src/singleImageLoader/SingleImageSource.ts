import { TileSource } from "three-tile";

export class SingleImageSource extends TileSource {
	public dataType = "image";
	public image?: HTMLImageElement;
}
