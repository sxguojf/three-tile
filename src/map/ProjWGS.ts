/**
 *@description: linear projection of latitude and longitude
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Projection, IProjection } from "./Projection";

//linear projection of latitude and longitude
export class ProjWGS extends Projection implements IProjection {
	public readonly ID = "4326";
	public readonly isWGS = true;
	public mapWidth = 36000; //E-W scacle (*0.01°)
	public mapHeight = 18000; //S-N scale (*0.01°)
	public mapDepth = 1; //height scale

	public project(lon: number, lat: number, centralMeridian: number): { x: number; y: number } {
		return { x: (lon - centralMeridian) * 100.0, y: lat * 100.0 };
	}
	public unProject(x: number, y: number, centralMeridian: number): { lon: number; lat: number } {
		return { lon: x / 100.0 + centralMeridian, lat: y / 100.0 };
	}
}
