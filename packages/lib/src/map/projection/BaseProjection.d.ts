/**
 *@description: Map projection abstruct class
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { IProjection, ProjectionType } from "./IProjection";
/**
 * Abstruct projection base class
 */
export declare abstract class Projection implements IProjection {
    abstract ID: ProjectionType;
    abstract mapWidth: number;
    abstract mapHeight: number;
    abstract mapDepth: number;
    abstract project(lon: number, lat: number): {
        x: number;
        y: number;
    };
    abstract unProject(x: number, y: number): {
        lon: number;
        lat: number;
    };
    private _lon0;
    /** 中央经线 */
    get lon0(): number;
    /**
     * 构造函数
     * @param centerLon 中央经线
     */
    constructor(centerLon?: number);
    /**
     * 根据中央经线取得变换后的瓦片X坐标
     * @param x
     * @param z
     * @returns
     */
    getTileXWithCenterLon(x: number, z: number): number;
    /**
     * 取得瓦片左下角投影坐标
     * @param x
     * @param y
     * @param z
     * @returns
     */
    getTileXYZproj(x: number, y: number, z: number): {
        x: number;
        y: number;
    };
    /**
     * 取得经纬度范围的投影坐标
     * @param bounds 经纬度边界
     * @returns 投影坐标
     */
    getProjBoundsFromLonLat(bounds: [number, number, number, number]): [number, number, number, number];
    /**
     * 取得瓦片边界投影坐标范围

     * @param x 瓦片X坐标
     * @param y 瓦片Y坐标
     * @param z  瓦片层级
     * @returns
     */
    getProjBoundsFromXYZ(x: number, y: number, z: number): [number, number, number, number];
    getLonLatBoundsFromXYZ(x: number, y: number, z: number): [number, number, number, number];
}
