/**
 *@description: Linear projection of latitude and longitude
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Projection } from "./BaseProjection";
import { IProjection } from "./IProjection";
/**
 * linear projection of latitude and longitude
 */
export declare class ProjWGS extends Projection implements IProjection {
    readonly ID = "4326";
    mapWidth: number;
    mapHeight: number;
    mapDepth: number;
    project(lon: number, lat: number): {
        x: number;
        y: number;
    };
    unProject(x: number, y: number): {
        lon: number;
        lat: number;
    };
}
