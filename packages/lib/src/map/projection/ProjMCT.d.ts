/**
 *@description: Mercator projection
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Projection } from "./BaseProjection";
import { IProjection } from "./IProjection";
/**
 * Mercator projection
 */
export declare class ProjMCT extends Projection implements IProjection {
    readonly ID = "3857";
    mapWidth: number;
    mapHeight: number;
    mapDepth: number;
    /**
     * Latitude and longitude to projected coordinates
     * @param lon longitude
     * @param lat Latitude
     * @returns projected coordinates
     */
    project(lon: number, lat: number): {
        x: number;
        y: number;
    };
    /**
     * Projected coordinates to latitude and longitude
     * @param x projection x
     * @param y projection y
     * @returns latitude and longitude
     */
    unProject(x: number, y: number): {
        lat: number;
        lon: number;
    };
}
