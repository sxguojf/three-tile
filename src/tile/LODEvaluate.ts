/**
 *@description: LOD evaluate
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Vector3 } from "three";
import { Tile } from ".";

const p1 = new Vector3(-0.5, -0.5, 0);
const p2 = new Vector3(0.5, 0.5, 0);

// Get the dist of tile to camera
function _getDist(tile: Tile, cameraPos: Vector3, z: number) {
	const tilePos = tile.position.clone().setZ(z).applyMatrix4(tile.matrixWorld);
	return cameraPos.distanceTo(tilePos);
}

// Get size of tile
function _getSize(tile: Tile) {
	const lt = p1.clone().applyMatrix4(tile.matrixWorld);
	const rb = p2.clone().applyMatrix4(tile.matrixWorld);
	return lt.sub(rb).length();
}

// Get dist ratio
function _getDistRatio(tile: Tile, cameraWorldPosition: Vector3) {
	// const cameraWorldPos = camera.getWorldPosition(_temVec3);
	const dist = _getDist(tile, cameraWorldPosition, tile.avgZ);
	const size = _getSize(tile);
	const ratio = (dist / size) * 0.8;
	// return 2 ** ratio * 0.5;
	return ratio;
}

export enum LODAction {
	none,
	create,
	remove,
}

/**
 * Tile LOD evaluate
 * @param tile
 * @param cameraWorldPosition
 * @param maxLevel
 * @param minLevel
 * @param threshold
 * @returns action
 */
export function evaluate(
	tile: Tile,
	cameraWorldPosition: Vector3,
	minLevel: number,
	maxLevel: number,
	threshold: number,
): LODAction {
	const factor = 1.02;
	if (tile.coord.z > minLevel && tile.index === 0 && tile.parent?.isTile) {
		const dist = _getDistRatio(tile.parent, cameraWorldPosition);
		if (tile.coord.z > maxLevel || dist > threshold * factor) {
			return LODAction.remove;
		}
	}
	if (tile.coord.z < maxLevel && tile.isLeafInFrustum) {
		const dist = _getDistRatio(tile, cameraWorldPosition);
		tile.userData.dist = dist;
		if (tile.coord.z < minLevel || dist < threshold / factor) {
			return LODAction.create;
		}
	}
	return LODAction.none;
}
