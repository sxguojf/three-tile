/**
 *@description: LOD
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Camera, Vector3 } from "three";
import { Tile } from ".";

const _temVec3 = new Vector3();

// get the dist of tile to camera
function _getDist(tile: Tile, cameraPos: Vector3, z: number) {
	const tilePos = tile.position.clone().setZ(z).applyMatrix4(tile.matrixWorld);
	return cameraPos.distanceTo(tilePos);
}

// get size of tile
function _getSize(tile: Tile) {
	const lt = new Vector3(-0.5, -0.5, 0).applyMatrix4(tile.matrixWorld);
	const rb = new Vector3(0.5, 0.5, 0).applyMatrix4(tile.matrixWorld);
	return lt.sub(rb).length();
}

// get dist ratio
function _getDistRatio(tile: Tile, camera: Camera) {
	const cameraWorldPos = camera.getWorldPosition(_temVec3);
	const dist = _getDist(tile, cameraWorldPos, tile.avgZ);
	const size = _getSize(tile);
	const ratio = dist / size;
	return Math.log10(ratio) * 5 + 0.5;
}

export enum LODAction {
	none,
	create,
	remove,
}

/**
 * get LOD action
 * @param tile
 * @param camera
 * @param maxLevel
 * @param minLevel
 * @param threshold
 * @returns action
 */
export function LOD(tile: Tile, camera: Camera, minLevel: number, maxLevel: number, threshold: number): LODAction {
	const factor = 1.02;
	if (tile.coord.z > minLevel && tile.index === 0 && tile.parent?.isTile) {
		const dist = _getDistRatio(tile.parent, camera);
		if (tile.coord.z > maxLevel || dist > threshold * factor) {
			return LODAction.remove;
		}
	}
	if (tile.coord.z < maxLevel && tile.isLeafInFrustum) {
		const dist = _getDistRatio(tile, camera);
		tile.userData.dist = dist;
		if (tile.coord.z < minLevel || dist < threshold / factor) {
			return LODAction.create;
		}
	}
	return LODAction.none;
}
