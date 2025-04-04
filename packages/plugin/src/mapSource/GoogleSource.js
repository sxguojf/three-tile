import { TileSource } from "three-tile";
/**
 * Google datasource, can not uese in CN
 */
export class GoogleSource extends TileSource {
    dataType = "image";
    attribution = "Google";
    maxLevel = 20;
    style = "y";
    subdomains = "0123";
    // 已失效
    // public url = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";
    // 2024年新地址，不知道能坚持多久。 续：坚持不到10天就挂了。
    // public url = "https://gac-geo.googlecnapps.club/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";
    // 访问原版google，你懂的
    url = "http://mt{s}.google.com/vt/lyrs={style}&src=app&x={x}&y={y}&z={z}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
