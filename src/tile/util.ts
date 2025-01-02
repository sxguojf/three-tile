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

export function getTileSize(tile: Tile) {
	const scale = tile.scale;
	const lt = new Vector3(-scale.x, -scale.y, 0).applyMatrix4(tile.matrixWorld);
	const rt = new Vector3(scale.x, scale.y, 0).applyMatrix4(tile.matrixWorld);
	return lt.sub(rt).length();
}

/**
 * Load the children tile from coordinate
 *
 * @param px parent tile x coordinate
 * @param py parent tile y coordinate
 * @param pz parent tile level
 * @param minLevel min level to load
 * @param onLoad callback when one tile loaded
 * @returns children tile array
 */
export function loadChildren(
	loader: ITileLoader,
	px: number,
	py: number,
	pz: number,
	minLevel: number,
	onLoad: (tile: Tile) => void,
): Tile[] {
	const getTile = (x: number, y: number, level: number, minLevle: number, onLoad: (tile: Tile) => void) => {
		const tile: Tile = level < minLevle ? new Tile(x, y, level) : loader.load(x, y, level, () => onLoad(tile));
		return tile;
	};

	const children = [];

	const level = pz + 1;
	const x = px * 2;
	const z = 0;
	const pos = 0.25;
	// Tow children at level 0 when GWS projection
	const isWGS = loader.imgSource[0].projectionID === "4326"; //ProjectionType.WGS84;
	if (pz === 0 && isWGS) {
		const y = py;
		const scale = new Vector3(0.5, 1.0, 1.0);
		const t1 = getTile(x, y, level, minLevel, () => onLoad(t1));
		const t2 = getTile(x, y, level, minLevel, () => onLoad(t2));
		t1.position.set(-pos, 0, z);
		t1.scale.copy(scale);
		t2.position.set(pos, 0, z);
		t2.scale.copy(scale);
		children.push(t1, t2);
	} else {
		const y = py * 2;
		const scale = new Vector3(0.5, 0.5, 1.0);
		const t1 = getTile(x, y, level, minLevel, () => onLoad(t1));
		const t2 = getTile(x + 1, y, level, minLevel, () => onLoad(t2));
		const t3 = getTile(x, y + 1, level, minLevel, () => onLoad(t3));
		const t4 = getTile(x + 1, y + 1, level, minLevel, () => onLoad(t4));
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
