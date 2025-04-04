import { TileSource } from "three-tile";
/**
 * Geoq datasource
 */
export class GeoqSource extends TileSource {
    dataType = "image";
    maxLevel = 16;
    attribution = "GeoQ[GS(2019)758号]";
    style = "ChinaOnlineStreetPurplishBlue";
    url = "https://map.geoq.cn/ArcGIS/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
