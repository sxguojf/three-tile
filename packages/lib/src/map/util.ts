/**
 *@description: Map function
 *@author: 郭江峰
 *@date: 2024-04-08
 */

import { Camera, Intersection, Object3D, Raycaster, Vector2, Vector3 } from "three";
import { LocationInfo, TileMap } from "./TileMap";
// import { GLViewer } from "../../tt";

const tempRay = new Raycaster();
const downVec3 = new Vector3(0, -1, 0);
const orginVec3 = new Vector3();

/**
 * 检测射线与模型的第一个交点
 * @param raycaster THREE.Raycaster 实例
 * @param object 要检测的 3D 对象（包括子对象）
 * @returns 第一个交点信息（THREE.Intersection）或 null
 */
export function findFirstIntersect(raycaster: Raycaster, object: Object3D): Intersection<Object3D> | undefined {
	// 1. 检测当前对象（不递归子对象）
	const intersects = raycaster.intersectObject(object, false);
	if (intersects.length > 0) {
		return intersects[0]; // 返回第一个交点
	}

	// 2. 递归检测子对象
	if (object.children && object.children.length > 0) {
		for (const child of object.children) {
			const result = findFirstIntersect(raycaster, child);
			if (result) return result; // 遇到交点立即返回
		}
	}

	return undefined; // 无交点
}

/**
 * get ground info from an ary
 * @param map
 * @param ray
 * @returns intersect info or undefined(not intersect)
 */
export function getLocalInfoFromRay(map: TileMap, ray: Raycaster): LocationInfo | undefined {
	// threejs R114 射线法会检测不可视对象相交： https://github.com/mrdoob/three.js/issues/14700
	const intersect = findFirstIntersect(ray, map.rootTile);
	if (intersect) {
		const point = map.worldToLocal(intersect.point.clone());
		const lonlat = map.map2geo(point);
		return Object.assign(intersect, {
			location: lonlat,
		}) as LocationInfo;
	}
	return undefined;
}

/**
 * get ground info from world coordinate
 * @param worldPosition world coordinate
 * @returns ground info
 */
export function getLocalInfoFromWorld(map: TileMap, worldPosition: Vector3) {
	// 原点（高空10000m）
	orginVec3.set(worldPosition.x, 10000, worldPosition.z);
	// 从原点垂直地面向下做一条射线
	tempRay.set(orginVec3, downVec3);
	return getLocalInfoFromRay(map, tempRay);
}

/**
 * get ground info from screen coordinate
 * @param camera
 * @param pointer screen coordiante（-0.5~0.5）
 * @returns ground info
 */
export function getLocalInfoFromScreen(camera: Camera, map: TileMap, pointer: Vector2) {
	tempRay.setFromCamera(pointer, camera);
	return getLocalInfoFromRay(map, tempRay);
}

export function attachEvent(map: TileMap) {
	const loadingManager = map.loader.manager;

	const dispatchEvent = (type: string, payload?: any) => {
		map.dispatchEvent({ type, ...payload });
	};

	// 添加瓦片加载事件
	loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
		dispatchEvent("loading-start", { url, itemsLoaded, itemsTotal });
	};
	loadingManager.onError = url => {
		dispatchEvent("loading-error", { url });
	};
	loadingManager.onLoad = () => {
		dispatchEvent("loading-complete");
	};
	loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
		dispatchEvent("loading-progress", { url, itemsLoaded, itemsTotal });
	};

	// 添加瓦片解析完成事件
	loadingManager.onParseEnd = geometry => {
		dispatchEvent("parsing-end", { geometry });
	};

	// 瓦片创建完成事件
	map.rootTile.addEventListener("tile-created", evt => {
		dispatchEvent("tile-created", { tile: evt.tile });
	});

	// 瓦片加载完成事件
	map.rootTile.addEventListener("tile-loaded", evt => {
		dispatchEvent("tile-loaded", { tile: evt.tile });
	});

	// 瓦片释放事件
	map.rootTile.addEventListener("tile-unload", evt => {
		dispatchEvent("tile-unload", { tile: evt.tile });
	});

	// 瓦片显示状态改变
	map.rootTile.addEventListener("tile-visible-changed", evt => {
		dispatchEvent("tile-visible-changed", { tile: evt.tile });
	});
}
