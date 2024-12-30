/**
 *@description: LOD evaluate
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Vector3 } from "three";
import { Tile } from ".";

// Get dist ratio
function _getDistRatio(tile: Tile) {
	return (tile.distToCamera / tile.sizeInWorld) * 0.8;
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
export function LODEvaluate(tile: Tile, minLevel: number, maxLevel: number, threshold: number): LODAction {
	const factor = 1.02;
	if (tile.coord.z > minLevel && tile.index === 0 && tile.parent?.isTile) {
		const dist = _getDistRatio(tile.parent);
		if (tile.coord.z > maxLevel || dist > threshold * factor || !tile.parent.inFrustum) {
			return LODAction.remove;
		}
	}
	if (tile.coord.z < maxLevel && tile.isLeaf && tile.inFrustum) {
		const dist = _getDistRatio(tile);
		if (tile.coord.z < minLevel || dist < threshold / factor) {
			return LODAction.create;
		}
	}
	return LODAction.none;
}

// Get the distance of camera to tile
export function getDistance(tile: Tile, cameraWorldPosition: Vector3) {
	const tilePos = tile.position.clone().setZ(tile.avgZ).applyMatrix4(tile.matrixWorld);
	return cameraWorldPosition.distanceTo(tilePos);
}

export function getTileSize(tile: Tile) {
	const scale = tile.scale;
	const lt = new Vector3(-scale.x, -scale.y, 0).applyMatrix4(tile.matrixWorld);
	const rt = new Vector3(scale.x, scale.y, 0).applyMatrix4(tile.matrixWorld);
	return lt.sub(rt).length();
}
