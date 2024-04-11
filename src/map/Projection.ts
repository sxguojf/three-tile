/**
 *@description: projection
 *@author: Guojf
 *@date: 2023-04-06
 */

import { ProjMCT, ProjWGS } from ".";
import { ISource } from "../source";

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
	isWGS: boolean; // is WGS projection?

	project(lon: number, lat: number, centralMeridian: number): { x: number; y: number };
	unProject(x: number, y: number, centralMeridian: number): { lon: number; lat: number };
}

/**
 * abstruct projection base class
 */
export abstract class Projection {
	public isWGS = false;

	/**
	 * create projection object from projection ID
	 *
	 * @param id projeciton ID, default: "3857"
	 * @returns IProjection instance
	 */
	public static createFromID(id: ProjectionType = "3857") {
		let proj: IProjection;
		switch (id) {
			case "3857":
				proj = new ProjMCT();
				break;
			case "4326":
				proj = new ProjWGS();
				break;
		}
		return proj;
	}

	/**
	 * create projection object from map source
	 * @param source map source
	 * @returns IProjection instance
	 */
	public static createFromSource(source: ISource) {
		let projID: ProjectionType = "3857";
		if (source) {
			projID = source.projection as ProjectionType;
		}
		return Projection.createFromID(projID);
	}
}
