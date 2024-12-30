/**
 *@description: LOD evaluate
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Vector3 } from "three";
import { RootTile, Tile } from ".";

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

export function createTile(
	root: RootTile,
	x: number,
	y: number,
	z: number,
	position: Vector3,
	scale: Vector3,
	onLoad: (tile: Tile) => void,
) {
	const tile =
		z < root.minLevel
			? new Tile(x, y, z)
			: root.loader.load1(x, y, z, () => {
					// Parent is null mean the tile has dispose
					if (!tile.parent) {
						return;
					}
					tile.onLoaded();
					onLoad(tile);
			  });
	tile.position.copy(position);
	tile.scale.copy(scale);
	return tile;
}

export function creatChildrenTile(root: RootTile, parent: Tile, onLoad: (tile: Tile) => void) {
	const level = parent.coord.z + 1;
	const x = parent.coord.x * 2;
	const z = 0;
	const pos = 0.25;
	// Tow childdren at level 0 when GWS projection
	if (parent.coord.z === 0 && root.isWGS) {
		const y = parent.coord.y;
		const scale = new Vector3(0.5, 1.0, 1.0);
		parent.add(createTile(root, x, y, level, new Vector3(-pos, 0, z), scale, onLoad)); //left
		parent.add(createTile(root, x + 1, y, level, new Vector3(pos, 0, z), scale, onLoad)); //right
	} else {
		const y = parent.coord.y * 2;
		const scale = new Vector3(0.5, 0.5, 1.0);
		parent.add(createTile(root, x, y + 1, level, new Vector3(-pos, -pos, z), scale, onLoad)); //left-bottom
		parent.add(createTile(root, x + 1, y + 1, level, new Vector3(pos, -pos, z), scale, onLoad)); // right-bottom
		parent.add(createTile(root, x, y, level, new Vector3(-pos, pos, z), scale, onLoad)); //left-top
		parent.add(createTile(root, x + 1, y, level, new Vector3(pos, pos, z), scale, onLoad)); //right-top
	}
	parent.children.forEach((child) => {
		child.updateMatrix();
		child.updateMatrixWorld();
		child.sizeInWorld = getTileSize(child);
	});
	return parent.children;
}
