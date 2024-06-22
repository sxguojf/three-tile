// projection ID, only support 3857 and 4326

export type ProjectionType = "3857" | "4326";
/**
 * Porjection interface
 */

export interface IProjection {
	ID: ProjectionType;
	mapWidth: number; // W-E scale
	mapHeight: number; // N-S scale
	mapDepth: number; // height scale
	centralMeridian: number; // central meridian
	isWGS: boolean; // is WGS projection?

	project(lon: number, lat: number): { x: number; y: number };
	unProject(x: number, y: number): { lon: number; lat: number };
	getProjTileX(x: number, z: number): number;
	getPorjBounds(bounds: [number, number, number, number]): { maxX: number; maxY: number; minX: number; minY: number };
	tileXYZ2proj(x: number, y: number, z: number): { x: number; y: number };
}
