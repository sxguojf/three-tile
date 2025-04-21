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

export class ProjWGS extends Projection implements IProjection {
	public readonly ID = "4326";
	public mapWidth = 36000; //E-W scacle (*0.01°)
	public mapHeight = 18000; //S-N scale (*0.01°)
	public mapDepth = 1; //height scale

	public project(lon: number, lat: number): { x: number; y: number } {
		return { x: (lon - this.lon0) * 100.0, y: lat * 100.0 };
	}
	public unProject(x: number, y: number): { lon: number; lat: number } {
		return { lon: x / 100.0 + this.lon0, lat: y / 100.0 };
	}
}
