/**
 *@description: Map function
 *@author: Guojf
 *@date: 2024-04-08
 */

import { Camera, Intersection, Raycaster, Vector2, Vector3 } from "three";
import { Tile } from "../tile";
import { TileMap } from "./TileMap";

const downVec3 = new Vector3(0, 0, -1);

/**
 * ground location inifo type
 */
export interface LocationInfo extends Intersection {
	location: Vector3;
}

/**
 * get ground info from an ary
 * @param map
 * @param ray
 * @returns intersect info or undefined(not intersect)
 */
export function getLocalInfoFromRay(map: TileMap, ray: Raycaster) {
	const intersects = ray.intersectObjects<Tile>([map.rootTile]);
	for (const intersect of intersects) {
		if (intersect.object instanceof Tile) {
			// intersect point to local point
			const point = map.worldToLocal(intersect.point);
			const lonlat = map.pos2geo(point);
			return Object.assign(intersect, {
				location: lonlat,
			}) as LocationInfo;
		}
	}
	return undefined;
}

/**
 * get ground info from world coordinate
 * @param worldPosition world coordinate
 * @returns ground info
 */
export function getLocalInfoFromWorld(map: TileMap, worldPosition: Vector3) {
	// // 原点（高空10km）
	const origin = new Vector3(worldPosition.x, worldPosition.y, 10);
	// 从原点垂直地面向下做一条射线
	const ray = new Raycaster(origin, downVec3);
	return getLocalInfoFromRay(map, ray);
}

/**
 * get ground info from screen coordinate
 * @param camera
 * @param pointer screen coordiante（-0.5~0.5）
 * @returns ground info
 */
export function getLocalInfoFromScreen(camera: Camera, map: TileMap, pointer: Vector2) {
	const ray = new Raycaster();
	ray.setFromCamera(pointer, camera);
	return getLocalInfoFromRay(map, ray);
}
