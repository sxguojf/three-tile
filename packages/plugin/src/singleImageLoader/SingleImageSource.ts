import { TileSource } from "three-tile";

/** 单影像数据源 */
export class SingleImageSource extends TileSource {
	/** 该数据源的类型标识 */
	public dataType = "single-image";
	/** 影像数据，内部使用 */
	public _image?: HTMLImageElement;
}
