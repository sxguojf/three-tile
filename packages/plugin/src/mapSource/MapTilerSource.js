import { TileSource } from "three-tile";
/**
 * MapTiler data source
 */
export class MapTilerSource extends TileSource {
    attribution = "MapTiler";
    token = "get_your_own_key_QmavnBrQwNGsQ8YvPzZg";
    format = "jpg";
    style = "satellite-v2";
    url = "https://api.maptiler.com/tiles/{style}/{z}/{x}/{y}.{format}?key={token}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
