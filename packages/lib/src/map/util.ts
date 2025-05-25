/**
 *@description: Map function
 *@author: 郭江峰
 *@date: 2024-04-08
 */

import { Camera, Intersection, Mesh, Raycaster, Vector2, Vector3 } from "three";
import { TileMap } from "./TileMap";
// import { GLViewer } from "../../tt";

const tempRay = new Raycaster();
const downVec3 = new Vector3(0, -1, 0);
const orginVec3 = new Vector3();
/**
 * ground location inifo type
 */
export interface LocationInfo extends Intersection {
	location: Vector3;
}

/**
 * get ground info from an ary
 * @param map
 * @param ray
 * @returns intersect info or undefined(not intersect)
 */
export function getLocalInfoFromRay(map: TileMap, ray: Raycaster): LocationInfo | undefined {
	// threejs R114 射线法会检测不可视对象相交： https://github.com/mrdoob/three.js/issues/14700
	const intersects = ray.intersectObject<Mesh>(map.rootTile, true);
	for (const intersect of intersects) {
		// intersect point to local point
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
