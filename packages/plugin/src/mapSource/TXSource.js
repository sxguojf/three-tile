import { TileSource } from "three-tile";
/** Tencent datasource */
export class TXSource extends TileSource {
    dataType = "image";
    style = "sateTiles";
    attribution = "腾讯[GS(2023)1号]";
    subdomains = "0123";
    maxLevel = 18;
    isTMS = true;
    // public url = "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
    sx = 0;
    sy = 0;
    url = "https://p{s}.map.gtimg.com/{style}/{z}/{sx}/{sy}/{x}_{y}.jpg";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
    _getUrl(x, y, z) {
        // https://blog.csdn.net/mygisforum/article/details/22997879
        // 腾讯瓦片计算方法：URL = z  /  Math.Floor(x / 16.0)  / Math.Floor(y / 16.0) / x_y.png，其中x,y,z为TMS瓦片坐标参数。
        this.sx = x >> 4;
        this.sy = ((1 << z) - y) >> 4;
        return super._getUrl(x, y, z);
    }
}
