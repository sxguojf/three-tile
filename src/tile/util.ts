/**
 *@description: Tile uitls
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Vector3 } from "three";
import { Tile } from ".";
import { ITileLoader } from "../loader";

export enum LODAction {
	none,
	create,
	remove,
}

/**
 * Tile LOD evaluate
 * @param tile
 * @param maxLevel
 * @param minLevel
 * @param threshold
 * @returns action
 */
export function LODEvaluate(tile: Tile, minLevel: number, maxLevel: number, threshold: number): LODAction {
	// Get dist ratio
	function getDistRatio(tile: Tile) {
		return (tile.distToCamera / tile.sizeInWorld) * 0.8;
	}

	const factor = 1.02;
	if (tile.z > minLevel && tile.index === 0 && tile.parent?.isTile) {
		const dist = getDistRatio(tile.parent);
		if (tile.z > maxLevel || dist > threshold * factor || !tile.parent.inFrustum) {
			return LODAction.remove;
		}
	}
	if (tile.z < maxLevel && tile.isLeaf && tile.inFrustum) {
		const dist = getDistRatio(tile);
		if (tile.z < minLevel || dist < threshold / factor) {
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

export function creatChildrenTile(parent: Tile, loader: ITileLoader, minLevel: number, onLoad: (tile: Tile) => void) {
	function getTileSize(tile: Tile) {
		const scale = tile.scale;
		const lt = new Vector3(-scale.x, -scale.y, 0).applyMatrix4(tile.matrixWorld);
		const rt = new Vector3(scale.x, scale.y, 0).applyMatrix4(tile.matrixWorld);
		return lt.sub(rt).length();
	}
	const children = loader.loadChildren(parent.x, parent.y, parent.z, minLevel, onLoad);
	parent.add(...children);
	children.forEach((child) => {
		child.updateMatrix();
		child.updateMatrixWorld();
		child.sizeInWorld = getTileSize(child);
		child.receiveShadow = parent.receiveShadow;
		child.castShadow = parent.castShadow;
	});
	return children;
}
