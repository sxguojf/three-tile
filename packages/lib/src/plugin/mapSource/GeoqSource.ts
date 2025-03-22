import { SourceOptions, TileSource } from "../../source/TileSource";

export type GeoqSourceOptions = SourceOptions & { style?: string };

/**
 * Geoq datasource
 */
export class GeoqSource extends TileSource {
	public dataType = "image";
	public maxLevel = 16;
	public attribution = "GeoQ[GS(2019)758号]";
	public style: string = "ChinaOnlineStreetPurplishBlue";
	public url = "https://map.geoq.cn/ArcGIS/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
	constructor(options?: GeoqSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
