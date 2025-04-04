import { TileSource } from "three-tile";
/**
 * TianDiTu datasource
 */
export class TDTSource extends TileSource {
    dataType = "image";
    attribution = "天地图[GS(2023)336号]";
    token = "";
    style = "img_w";
    subdomains = "01234";
    url = "https://t{s}.tianditu.gov.cn/DataServer?T={style}&x={x}&y={y}&l={z}&tk={token}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
export class TDTQMSource extends TileSource {
    dataType = "quantized-mesh";
    attribution = "天地图[GS(2023)336号]";
    token = "";
    subdomains = "01234";
    url = "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk={token}&x={x}&y={y}&l={z}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
