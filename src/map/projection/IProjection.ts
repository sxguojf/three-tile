/**
 *@description: Map projection interface
 *@author: Guojf
 *@date: 2023-04-06
 */

// projection ID, only support 3857 and 4326
export type ProjectionType = "3857" | "4326";

/**
 * Porjection interface
 */
export interface IProjection {
	readonly ID: ProjectionType;
	readonly mapWidth: number; // W-E scale
	readonly mapHeight: number; // N-S scale
	readonly mapDepth: number; // height scale
	readonly lon0: number; // central meridian

	project(lon: number, lat: number): { x: number; y: number };
	unProject(x: number, y: number): { lon: number; lat: number };
	getTileXWithCenterLon(x: number, z: number): number;
	getPorjBounds(bounds: [number, number, number, number]): [number, number, number, number];
	getTileBounds(x: number, y: number, z: number): [number, number, number, number];
}
