/**
 *@description: projection
 *@author: Guojf
 *@date: 2023-04-06
 */

import { IProjection, ProjectionType } from "./IProjection";

/**
 * abstruct projection base class
 */
export abstract class Projection implements IProjection {
	abstract ID: ProjectionType;
	abstract mapWidth: number;
	abstract mapHeight: number;
	abstract mapDepth: number;
	abstract isWGS: boolean;
	abstract project(lon: number, lat: number): { x: number; y: number };
	abstract unProject(x: number, y: number): { lon: number; lat: number };

	private _centralMeridian: number = 0;
	public get centralMeridian(): number {
		return this._centralMeridian;
	}

	public constructor(centerLon: number = 0) {
		this._centralMeridian = centerLon;
	}

	public getTileXWithCenterLon(x: number, z: number) {
		const n = Math.pow(2, z);
		let newx = x + Math.round((n / 360) * this._centralMeridian);
		if (newx >= n) {
			newx -= n;
		} else if (newx < 0) {
			newx += n;
		}
		return newx;
	}

	public getPorjBounds(bounds: [number, number, number, number]) {
		const p1 = this.project(bounds[0], bounds[1]);
		const p2 = this.project(bounds[2], bounds[3]);
		return {
			minX: Math.min(p1.x, p2.x),
			minY: Math.min(p1.y, p2.y),
			maxX: Math.max(p1.x, p2.x),
			maxY: Math.max(p1.y, p2.y),
		};
	}

	public getXYZproj(x: number, y: number, z: number) {
		const w = this.mapWidth;
		const h = this.mapHeight / 2;
		const px = (x / Math.pow(2, z)) * w - w / 2;
		const py = h - (y / Math.pow(2, z)) * h * 2;
		return { x: px, y: py };
	}
}
