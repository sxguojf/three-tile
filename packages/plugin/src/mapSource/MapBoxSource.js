import { TileSource } from "three-tile";
/**
 * MapBox datasource
 */
export class MapBoxSource extends TileSource {
    token = "";
    format = "webp";
    style = "mapbox.satellite";
    attribution = "MapBox";
    maxLevel = 19;
    url = "https://api.mapbox.com/v4/{style}/{z}/{x}/{y}.{format}?access_token={token}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
