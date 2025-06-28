import { TileSource } from "three-tile";
import { DEMType } from "./parse";

/** 单TIF图像高程 */
export class SingleTifDEMSource extends TileSource {
	/** 该数据源的类型标识 */
	public dataType = "single-tif";
	/** 瓦片裙边高度(m) */
	public skirtHeight = 1000;
	/** 高程数据，内部使用 */
	public data?: DEMType;
}
