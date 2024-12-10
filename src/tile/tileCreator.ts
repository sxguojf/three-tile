/**
 *@description: tile creator
 *@author: Guojf
 *@date: 2023-04-05
 */

import { Vector3 } from "three";
import { Tile } from ".";

function createTile(x: number, y: number, level: number, position: Vector3, scale: Vector3) {
	const tile = new Tile(x, y, level);
	tile.renderOrder = 0;
	tile.position.copy(position);
	tile.scale.copy(scale);
	return tile;
}

/**
 * Create children tiles
 * @param parent parent tile
 * @param isWGS  is WGS projection
 * @returns tiles
 */
export function creatChildrenTile(parent: Tile, isWGS = false) {
	if (parent.isTile) {
		const level = parent.coord.z + 1;
		const x = parent.coord.x * 2;
		const z = 0;
		const p = 1 / 4;
		// Tow childdren at level 0 when GWS projection
		if (parent.coord.z === 0 && isWGS) {
			const y = parent.coord.y;
			const scale = new Vector3(0.5, 1.0, 1.0);
			parent.add(createTile(x, y, level, new Vector3(-p, 0, z), scale)); //left
			parent.add(createTile(x + 1, y, level, new Vector3(p, 0, z), scale)); //right
		} else {
			const y = parent.coord.y * 2;
			const scale = new Vector3(0.5, 0.5, 1.0);
			parent.add(createTile(x, y + 1, level, new Vector3(-p, -p, z), scale)); //left-bottom
			parent.add(createTile(x + 1, y + 1, level, new Vector3(p, -p, z), scale)); // right-bottom
			parent.add(createTile(x, y, level, new Vector3(-p, p, z), scale)); //left-top
			parent.add(createTile(x + 1, y, level, new Vector3(p, p, z), scale)); //right-top
		}
		parent.children.forEach((child) => {
			child.updateMatrix();
			child.updateMatrixWorld();
			child.receiveShadow = parent.receiveShadow;
			child.castShadow = parent.castShadow;
		});
	}
	return parent.children;
}
