/**
 *@description: Tile uitls
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Tile } from ".";
import { ITileLoader } from "../loader";

/** 瓦片 LOD 结果 */
export enum LODAction {
	none, // 无操作
	create, // 细化
	remove, // 合并
}

/**
 * 根据摄像机到瓦片的距离，评估瓦片是否需要细化或合并
 * @param tile 瓦片实例
 * @param minLevel 地图最小层级
 * @param maxLevel 地图最大层级
 * @param threshold 瓦片LOD阈值
 * @returns LODAction 细化或合并还无动作
 */
export function LODEvaluate(tile: Tile, minLevel: number, maxLevel: number, threshold: number): LODAction {
	if (tile.z > maxLevel) {
		return LODAction.remove;
	}
	const distRatio = tile.distRatio;
	if (
		tile.isLeaf &&
		tile.inFrustum &&
		tile.z < maxLevel &&
		distRatio < threshold &&
		(tile.showing || tile.z <= minLevel)
	) {
		return LODAction.create;
	}
	if (!tile.isLeaf && tile.z >= minLevel && distRatio > threshold) {
		return LODAction.remove;
	}
	return LODAction.none;
}

/**
 * 创建瓦片
 * @param x 瓦片X坐标
 * @param y 瓦片Y坐标
 * @param z 瓦片层级
 * @param px 瓦片位置X
 * @param py 瓦片位置Y
 * @param sx 瓦片缩放X
 * @param sy 瓦片缩放Y
 * @param sz 瓦片缩放Z
 * @returns 子瓦片实例
 */
function creatTile(x: number, y: number, z: number, px: number, py: number, sx: number, sy: number, sz: number) {
	const tile = new Tile(x, y, z);
	tile.position.set(px, py, 0);
	tile.scale.set(sx, sy, sz);
	tile.updateMatrix();
	return tile;
}

/**
 * 创建子瓦片
 * @param parentTile 父瓦片
 * @param loader 瓦片加载器
 * @returns 子瓦片数组
 */
export function createChildren(parentTile: Tile, loader: ITileLoader): Tile[] {
	const { x: parentX, y: parentY, z: parentZ } = parentTile;
	const children: Tile[] = [];

	const x = parentX * 2;
	const z = parentZ + 1;
	const p = 0.25;
	const sx = 0.5;
	const sz = 1.0;

	if (parentZ === 0 && loader.imgSource[0].projectionID === "4326") {
		// EPSG:4326 瓦片0级只有2块子瓦片
		const y = parentY;
		const sy = 1.0;
		const t1 = creatTile(x, y, z, -p, 0, sx, sy, sz);
		const t2 = creatTile(x + 1, y, z, p, 0, sx, sy, sz);
		children.push(t1, t2);
	} else {
		// 其它情况都为4块子瓦片
		const y = parentY * 2;
		const sy = 0.5;
		const t1 = creatTile(x, y, z, -p, p, sx, sy, sz);
		const t2 = creatTile(x + 1, y, z, p, p, sx, sy, sz);
		const t3 = creatTile(x, y + 1, z, -p, -p, sx, sy, sz);
		const t4 = creatTile(x + 1, y + 1, z, p, -p, sx, sy, sz);
		children.push(t1, t2, t3, t4);
	}

	return children;
}
