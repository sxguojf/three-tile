import { GeoTIFFImage } from "geotiff";
import { TileSource } from "../../source/TileSource";

export class TifDemSource extends TileSource {
	public dataType = "tif-dem";
	public data?: GeoTIFFImage;
}
