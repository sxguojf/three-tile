/**
 *@description: Map projection interface
 *@author: 郭江峰
 *@date: 2023-04-06
 */
export type ProjectionType = "3857" | "4326";
/**
 * Porjection interface
 */
export interface IProjection {
    readonly ID: ProjectionType;
    readonly mapWidth: number;
    readonly mapHeight: number;
    readonly mapDepth: number;
    readonly lon0: number;
    project(lon: number, lat: number): {
        x: number;
        y: number;
    };
    unProject(x: number, y: number): {
        lon: number;
        lat: number;
    };
    getTileXWithCenterLon(x: number, z: number): number;
    getProjBoundsFromLonLat(bounds: [number, number, number, number]): [number, number, number, number];
    getProjBoundsFromXYZ(x: number, y: number, z: number): [number, number, number, number];
    getLonLatBoundsFromXYZ(x: number, y: number, z: number): [number, number, number, number];
}
