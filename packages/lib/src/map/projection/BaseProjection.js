/**
 *@description: Map projection abstruct class
 *@author: 郭江峰
 *@date: 2023-04-06
 */
/**
 * Abstruct projection base class
 */
export class Projection {
    _lon0 = 0;
    /** 中央经线 */
    get lon0() {
        return this._lon0;
    }
    /**
     * 构造函数
     * @param centerLon 中央经线
     */
    constructor(centerLon = 0) {
        this._lon0 = centerLon;
    }
    /**
     * 根据中央经线取得变换后的瓦片X坐标
     * @param x
     * @param z
     * @returns
     */
    getTileXWithCenterLon(x, z) {
        const n = Math.pow(2, z);
        let newx = x + Math.round((n / 360) * this._lon0);
        if (newx >= n) {
            newx -= n;
        }
        else if (newx < 0) {
            newx += n;
        }
        return newx;
    }
    /**
     * 取得瓦片左下角投影坐标
     * @param x
     * @param y
     * @param z
     * @returns
     */
    getTileXYZproj(x, y, z) {
        const w = this.mapWidth;
        const h = this.mapHeight / 2;
        const px = (x / Math.pow(2, z)) * w - w / 2;
        const py = h - (y / Math.pow(2, z)) * h * 2;
        return { x: px, y: py };
    }
    /**
     * 取得经纬度范围的投影坐标
     * @param bounds 经纬度边界
     * @returns 投影坐标
     */
    getProjBoundsFromLonLat(bounds) {
        // 加上投影中心经度后，投影x坐标范围与设置的经度范围不一定相等，所以判断是否为全球范围投影
        const withCenter = bounds[0] === -180 && bounds[2] === 180;
        const p1 = this.project(bounds[0] + (withCenter ? this._lon0 : 0), bounds[1]);
        const p2 = this.project(bounds[2] + (withCenter ? this._lon0 : 0), bounds[3]);
        // const p1 = this.project(bounds[0], bounds[1]);
        // const p2 = this.project(bounds[2], bounds[3]);
        return [Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)];
    }
    /**
     * 取得瓦片边界投影坐标范围

     * @param x 瓦片X坐标
     * @param y 瓦片Y坐标
     * @param z  瓦片层级
     * @returns
     */
    getProjBoundsFromXYZ(x, y, z) {
        const p1 = this.getTileXYZproj(x, y, z);
        const p2 = this.getTileXYZproj(x + 1, y + 1, z);
        return [Math.min(p1.x, p2.x), Math.min(p1.y, p2.y), Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)];
    }
    getLonLatBoundsFromXYZ(x, y, z) {
        const projectBounds = this.getProjBoundsFromXYZ(x, y, z);
        const p1 = this.unProject(projectBounds[0], projectBounds[1]);
        const p2 = this.unProject(projectBounds[2], projectBounds[3]);
        return [p1.lon, p1.lat, p2.lon, p2.lat];
    }
}
