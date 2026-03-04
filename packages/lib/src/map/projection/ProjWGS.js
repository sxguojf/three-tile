/**
 *@description: Linear projection of latitude and longitude
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Projection } from "./BaseProjection";
/**
 * linear projection of latitude and longitude
 */
export class ProjWGS extends Projection {
    constructor() {
        super(...arguments);
        this.ID = "4326";
        this.mapWidth = 36000 * 1000; //E-W scacle (*0.01°)
        this.mapHeight = 18000 * 1000; //S-N scale (*0.01°)
        this.mapDepth = 1; //height scale
    }
    project(lon, lat) {
        return { x: (lon - this.lon0) * 100 * 1000, y: lat * 100 * 1000 };
    }
    unProject(x, y) {
        return { lon: x / (100 * 1000) + this.lon0, lat: y / (100 * 1000) };
    }
}
