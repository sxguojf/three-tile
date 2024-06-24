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
	isWGS: boolean; // is WGS projection?

	project(lon: number, lat: number): { x: number; y: number };
	unProject(x: number, y: number): { lon: number; lat: number };
	getTileXWithCenterLon(x: number, z: number): number;
	getPorjBounds(bounds: [number, number, number, number]): { maxX: number; maxY: number; minX: number; minY: number };
	getTileXYZproj(x: number, y: number, z: number): { x: number; y: number };
}
