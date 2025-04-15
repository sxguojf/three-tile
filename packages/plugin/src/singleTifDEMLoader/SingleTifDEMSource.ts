import GeoTIFF from "geotiff";
import { TileSource } from "three-tile";

/** 单TIF图像高程 */
export class SingleTifDEMSource extends TileSource {
	/** 该数据源的类型标识 */
	public dataType = "single-tif";
	/** 高程数据，内部使用 */
	public _data?: GeoTIFF;
}
