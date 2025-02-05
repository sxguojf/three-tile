/**
 *@description: Mercator projection
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Projection } from "./BaseProjection";
import { IProjection } from "./IProjection";

const EarthRad = 6378; //Earth's radius(km)

/**
 * Mercator projection
 */
export class ProjMCT extends Projection implements IProjection {
	public readonly ID = "3857"; // projeciton ID
	public mapWidth = 2 * Math.PI * EarthRad; //E-W scacle Earth's circumference(km)
	public mapHeight = this.mapWidth; //S-N scacle Earth's circumference(km)
	public mapDepth = 1; //Height scale

	/**
	 * Latitude and longitude to projected coordinates
	 * @param lon longitude
	 * @param lat Latitude
	 * @returns projected coordinates
	 */
	public project(lon: number, lat: number) {
		if (lon < 0) lon += 180; // 考虑经度跨度（-180~+180
		const lonRad = (lon - this.lon0) * (Math.PI / 180); // 考虑中心经度偏移
		// const lonRad = lon * (Math.PI / 180);
		const latRad = lat * (Math.PI / 180);
		const x = EarthRad * lonRad;
		const y = EarthRad * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
		return { x, y };
	}

	/**
	 * Projected coordinates to latitude and longitude
	 * @param x projection x
	 * @param y projection y
	 * @returns latitude and longitude
	 */

	public unProject(x: number, y: number) {
		// const lon = (((x / EarthRad / Math.PI) * 180 + this.lon0 + 180) % 360) - 180;
		// const lat = ((Math.atan(Math.exp(y / EarthRad)) * 2 - Math.PI / 2) * 180) / Math.PI;
		let lon = (x / EarthRad) * (180 / Math.PI) + this.lon0; // 考虑中心经度偏移
		// let lon = (x / EarthRad) * (180 / Math.PI);
		if (lon > 180) lon -= 360;

		const latRad = 2 * Math.atan(Math.exp(y / EarthRad)) - Math.PI / 2;
		const lat = latRad * (180 / Math.PI);

		return { lat, lon };
	}
}
