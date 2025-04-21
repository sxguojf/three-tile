/**
 *@description: Tile uitls
 *@author: 郭江峰
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

// Get the distance of camera to tile
export function getDistance(tile: Tile, cameraWorldPosition: Vector3) {
	const tilePos = tile.position.clone().setZ(tile.maxZ).applyMatrix4(tile.matrixWorld);
	return cameraWorldPosition.distanceTo(tilePos);
}

export function getTileSize(tile: Tile) {
	const scale = tile.scale;
	const lt = new Vector3(-scale.x, -scale.y, 0).applyMatrix4(tile.matrixWorld);
	const rt = new Vector3(scale.x, scale.y, 0).applyMatrix4(tile.matrixWorld);
	return lt.sub(rt).length();
}

function getDistRatio(tile: Tile): number {
	return (tile.distToCamera / tile.sizeInWorld) * 0.8;
}

/**
 * Evaluate the Level of Detail (LOD) action
 *
 * @param tile The tile object
 * @param minLevel The minimum level
 * @param maxLevel The maximum level
 * @param threshold The threshold value
 * @returns The LOD action type
 */
export function LODEvaluate(tile: Tile, minLevel: number, maxLevel: number, threshold: number): LODAction {
	// Get the tile's FOV
	const distRatio = getDistRatio(tile);

	if (tile.isLeaf) {
		// Only leaf tiles can create child tiles
		if (
			tile.inFrustum && // Tile is in frustum
			tile.z < maxLevel && // Tile level < map maxlevel
			(tile.z < minLevel || tile.showing) && // (Tile level < map minLevel ) || (Parent tile has showed)
			(tile.z < minLevel || distRatio < threshold) // (Tile level < map minLevel ) || (Distratio < threshold)
		) {
			return LODAction.create;
		}
	} else {
		// Only Non-leaf tile can remove child tiles
		if (
			tile.z >= minLevel && // Tile level >= map minLevel
			(tile.z > maxLevel || distRatio > threshold) // (Tile level > map maxLevel ) || (Distratio > threshold)
		) {
			return LODAction.remove;
		}
	}

	return LODAction.none;
}

/**
 * Load the children tile from coordinate
 * @param loader tile loader instance
 * @param px parent tile x coordinate
 * @param py parent tile y coordinate
 * @param pz parent tile level
 * @returns children tile array
 */
export function createChildren(loader: ITileLoader, px: number, py: number, pz: number): Tile[] {
	const children: Tile[] = [];
	const level = pz + 1;
	const x = px * 2;
	const z = 0;
	const pos = 0.25;
	// Two children at level 0 when 4326 projection
	const isWGS = loader.imgSource[0].projectionID === "4326";
	if (pz === 0 && isWGS) {
		const y = py;
		const scale = new Vector3(0.5, 1.0, 1.0);
		const t1 = new Tile(x, y, level);
		const t2 = new Tile(x, y, level);
		t1.position.set(-pos, 0, z);
		t1.scale.copy(scale);
		t2.position.set(pos, 0, z);
		t2.scale.copy(scale);
		children.push(t1, t2);
	} else {
		const y = py * 2;
		const scale = new Vector3(0.5, 0.5, 1.0);
		const t1 = new Tile(x, y, level);
		const t2 = new Tile(x + 1, y, level);
		const t3 = new Tile(x, y + 1, level);
		const t4 = new Tile(x + 1, y + 1, level);
		t1.position.set(-pos, pos, z);
		t1.scale.copy(scale);
		t2.position.set(pos, pos, z);
		t2.scale.copy(scale);
		t3.position.set(-pos, -pos, z);
		t3.scale.copy(scale);
		t4.position.set(pos, -pos, z);
		t4.scale.copy(scale);
		children.push(t1, t2, t3, t4);
	}

	return children;
}
