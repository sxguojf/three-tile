/**
 *@description: Tile uitls
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Vector3 } from "three";
import { Tile } from ".";
import { ITileLoader } from "../loader";

/** 瓦片 LOD 结果 */
export enum LODAction {
	none, // 无操作
	create, // 细化
	remove, // 合并
}

/**
 * 取得瓦片到摄像机的距离与瓦片对角线长度之比(距宽比)：≈tan(瓦片视宽角）
 * @param tile
 * @returns 距宽比
 */
function getDistRatio(tile: Tile): number {
	// 增大不在视锥体内瓦片的距离，以使它更快合并
	const dist = tile.distToCamera * (tile.inFrustum ? 0.8 : 5);
	return dist / tile.sizeInWorld;
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
	// 视椎体内叶子瓦片层级小于地图最小层级，直接返回细化
	if (tile.z < minLevel && tile.isLeaf && tile.inFrustum) {
		return LODAction.create;
	}
	// 非叶子瓦片层级大于地图最大层级，直接返回合并
	if (tile.z > maxLevel && !tile.isLeaf) {
		return LODAction.remove;
	}

	// 取得瓦片视宽角
	const distRatio = getDistRatio(tile);

	if (tile.isLeaf) {
		// 叶子瓦片可以细化
		if (tile.inFrustum && tile.z < maxLevel && distRatio < threshold && tile.showing) {
			return LODAction.create;
		}
	} else {
		// 非叶子瓦片可以合并
		if (tile.z >= minLevel && distRatio > threshold) {
			return LODAction.remove;
		}
	}
	return LODAction.none;
}

/**
 * 创建子瓦片
 * @param tile 父瓦片
 * @param loader 瓦片加载器
 * @returns 子瓦片数组
 */
export function createChildren(tile: Tile, loader: ITileLoader): Tile[] {
	const { x: px, y: py, z: pz } = tile;
	const children: Tile[] = [];
	const level = pz + 1;
	const x = px * 2;
	const z = 0;
	const pos = 0.25;

	if (pz === 0 && loader.imgSource[0].projectionID === "4326") {
		// EPSG:4326 瓦片0级只有2块子瓦片
		const y = py;
		const scale = new Vector3(0.5, 1.0, 1.0);
		const t1 = new Tile(x, y, level);
		const t2 = new Tile(x + 1, y, level);
		t1.position.set(-pos, 0, z);
		t1.scale.copy(scale);
		t2.position.set(pos, 0, z);
		t2.scale.copy(scale);
		children.push(t1, t2);
	} else {
		// 其它情况都为4块子瓦片
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
