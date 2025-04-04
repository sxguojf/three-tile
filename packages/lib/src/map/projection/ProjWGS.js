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
    ID = "4326";
    mapWidth = 36000; //E-W scacle (*0.01°)
    mapHeight = 18000; //S-N scale (*0.01°)
    mapDepth = 1; //height scale
    project(lon, lat) {
        return { x: (lon - this.lon0) * 100.0, y: lat * 100.0 };
    }
    unProject(x, y) {
        return { lon: x / 100.0 + this.lon0, lat: y / 100.0 };
    }
}
