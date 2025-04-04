import { TileSource } from "three-tile";
// https://[tiles1-tiles3].geovisearth.com/base/v1/ter/{z}/{x}/{y}
// https://[tiles1-tiles3].geovisearth.com/base/v1/cia/{z}/{x}/{y}
// https://[tiles1-tiles3].geovisearth.com/base/v1/vec/{z}/{x}/{y}
// https://[tiles1-tiles3].geovisearth.com/base/v1/terrain-rgb/{z}/{x}/{y}
/**
 * ZhongkeXingTu datasource
 */
export class ZKXTSource extends TileSource {
    attribution = "中科星图[GS(2022)3995号]";
    token = "";
    style = "img";
    format = "webp";
    subdomains = "12";
    url = "https://tiles{s}.geovisearth.com/base/v1/{style}/{z}/{x}/{y}?format={format}&tmsIds=w&token={token}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
// https://[tiles1-tiles3].geovisearth.com/base/v1/terrain/{z}/{x}/{y}.terrain
export class ZKXTQMSource extends TileSource {
    dataType = "quantized-mesh";
    attribution = "中科星图[GS(2022)3995号]";
    token = "";
    subdomains = "012";
    url = "https://tiles{s}.geovisearth.com/base/v1/terrain/{z}/{x}/{y}.terrain&token={token}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
