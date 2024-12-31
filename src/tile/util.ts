/**
 *@description: Tile uitls
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Vector3 } from "three";
import { Tile } from ".";
import { ITileLoader } from "../loader";

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
 * @param maxLevel
 * @param minLevel
 * @param threshold
 * @returns action
 */
export function LODEvaluate(tile: Tile, minLevel: number, maxLevel: number, threshold: number): LODAction {
	const factor = 1.02;
	if (tile.z > minLevel && tile.index === 0 && tile.parent?.isTile) {
		const dist = _getDistRatio(tile.parent);
		if (tile.z > maxLevel || dist > threshold * factor || !tile.parent.inFrustum) {
			return LODAction.remove;
		}
	}
	if (tile.z < maxLevel && tile.isLeaf && tile.inFrustum) {
		const dist = _getDistRatio(tile);
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

function getTileSize(tile: Tile) {
	const scale = tile.scale;
	const lt = new Vector3(-scale.x, -scale.y, 0).applyMatrix4(tile.matrixWorld);
	const rt = new Vector3(scale.x, scale.y, 0).applyMatrix4(tile.matrixWorld);
	return lt.sub(rt).length();
}

export function createTile(
	loader: ITileLoader,
	x: number,
	y: number,
	z: number,
	position: Vector3,
	scale: Vector3,
	minLevel: number,
	onLoad: (tile: Tile) => void,
) {
	const tile =
		z < minLevel
			? new Tile(x, y, z)
			: loader.load(x, y, z, () => {
					// Parent is null mean the tile has dispose
					tile.parent && onLoad(tile);
			  });
	tile.position.copy(position);
	tile.scale.copy(scale);
	return tile;
}

export function creatChildrenTile(
	parent: Tile,
	loader: ITileLoader,
	isWGS: boolean,
	minLevel: number,
	onLoad: (tile: Tile) => void,
) {
	const level = parent.z + 1;
	const x = parent.x * 2;
	const z = 0;
	const pos = 0.25;
	// Tow childdren at level 0 when GWS projection
	if (parent.z === 0 && isWGS) {
		const y = parent.y;
		const scale = new Vector3(0.5, 1.0, 1.0);
		parent.add(createTile(loader, x, y, level, new Vector3(-pos, 0, z), scale, minLevel, onLoad)); //left
		parent.add(createTile(loader, x + 1, y, level, new Vector3(pos, 0, z), scale, minLevel, onLoad)); //right
	} else {
		const y = parent.y * 2;
		const scale = new Vector3(0.5, 0.5, 1.0);
		parent.add(createTile(loader, x, y + 1, level, new Vector3(-pos, -pos, z), scale, minLevel, onLoad)); //left-bottom
		parent.add(createTile(loader, x + 1, y + 1, level, new Vector3(pos, -pos, z), scale, minLevel, onLoad)); // right-bottom
		parent.add(createTile(loader, x, y, level, new Vector3(-pos, pos, z), scale, minLevel, onLoad)); //left-top
		parent.add(createTile(loader, x + 1, y, level, new Vector3(pos, pos, z), scale, minLevel, onLoad)); //right-top
	}
	parent.children.forEach((child) => {
		child.updateMatrix();
		child.updateMatrixWorld();
		child.sizeInWorld = getTileSize(child);
	});
	return parent.children;
}
