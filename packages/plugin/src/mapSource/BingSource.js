import { TileSource } from "three-tile";
/**
 * Bing datasource
 */
export class BingSource extends TileSource {
    dataType = "image";
    attribution = "Bing[GS(2021)1731号]";
    style = "A";
    mkt = "zh-CN";
    subdomains = "123";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
    getUrl(x, y, z) {
        const key = quadKey(z, x, y);
        return (`https://t${this.s}.dynamic.tiles.ditu.live.com/comp/ch/${key}?` +
            `mkt=${this.mkt}&ur=CN&it=${this.style}&n=z&og=804&cstl=vb`);
    }
}
function quadKey(z, x, y) {
    let quad = "";
    for (let i = z; i > 0; i--) {
        const mask = 1 << (i - 1);
        let cell = 0;
        if ((x & mask) !== 0) {
            cell++;
        }
        if ((y & mask) !== 0) {
            cell += 2;
        }
        quad += cell;
    }
    return quad;
}
