import { TileSource } from "three-tile";
/**
 * GaoDe datasource
 */
export class GDSource extends TileSource {
    dataType = "image";
    attribution = "高德[GS(2021)6375号]";
    style = "8";
    subdomains = "1234";
    maxLevel = 18;
    url = "https://webst0{s}.is.autonavi.com/appmaptile?style={style}&x={x}&y={y}&z={z}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
