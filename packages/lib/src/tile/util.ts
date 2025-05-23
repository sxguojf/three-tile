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

	// 取得瓦片视宽角
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
