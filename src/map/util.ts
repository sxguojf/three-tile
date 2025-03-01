/**
 *@description: Map function
 *@author: 郭江峰
 *@date: 2024-04-08
 */

import { Camera, Intersection, Raycaster, Vector2, Vector3 } from "three";
import { Tile } from "../tile";
import { TileMap } from "./TileMap";

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
export function getLocalInfoFromRay(map: TileMap, ray: Raycaster) {
	const intersects = ray.intersectObjects<Tile>([map.rootTile]);
	for (const intersect of intersects) {
		if (intersect.object instanceof Tile) {
			// intersect point to local point
			const point = map.worldToLocal(intersect.point.clone());
			const lonlat = map.pos2geo(point);
			return Object.assign(intersect, {
				location: lonlat,
			}) as LocationInfo;
		}
	}
	return undefined;
}

/**
 * get ground info from world coordinate
 * @param worldPosition world coordinate
 * @returns ground info
 */
export function getLocalInfoFromWorld(map: TileMap, worldPosition: Vector3) {
	const downVec3 = new Vector3(0, -1, 0);
	// // 原点（高空10km）
	const origin = new Vector3(worldPosition.x, 10, worldPosition.z);
	// 从原点垂直地面向下做一条射线
	const ray = new Raycaster(origin, downVec3);
	return getLocalInfoFromRay(map, ray);
}

/**
 * get ground info from screen coordinate
 * @param camera
 * @param pointer screen coordiante（-0.5~0.5）
 * @returns ground info
 */
export function getLocalInfoFromScreen(camera: Camera, map: TileMap, pointer: Vector2) {
	const ray = new Raycaster();
	ray.setFromCamera(pointer, camera);
	return getLocalInfoFromRay(map, ray);
}

export function attachEvent(tileMap: TileMap) {
	const loadingManager = tileMap.loader.manager;

	const dispatchLoadingEvent = (type: string, payload?: any) => {
		tileMap.dispatchEvent({ type, ...payload });
	};

	// 添加瓦片加载事件
	loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
		dispatchLoadingEvent("loading-start", { url, itemsLoaded, itemsTotal });
	};
	loadingManager.onError = (url) => {
		dispatchLoadingEvent("loading-error", { url });
	};
	loadingManager.onLoad = () => {
		dispatchLoadingEvent("loading-complete");
	};
	loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
		dispatchLoadingEvent("loading-progress", { url, itemsLoaded, itemsTotal });
	};
	// 添加瓦片解析事件
	loadingManager.onParseStart = (url) => {
		dispatchLoadingEvent("parsing-start", { url });
	};
	loadingManager.onParseEnd = (url) => {
		dispatchLoadingEvent("parsing-end", { url });
	};

	// 地图准备就绪事件
	tileMap.rootTile.addEventListener("ready", () => dispatchLoadingEvent("ready"));

	// 瓦片创建完成事件
	tileMap.rootTile.addEventListener("tile-created", (evt) => {
		dispatchLoadingEvent("tile-created", { tile: evt.tile });
	});

	// 瓦片加载完成事件
	tileMap.rootTile.addEventListener("tile-loaded", (evt) => {
		dispatchLoadingEvent("tile-loaded", { tile: evt.tile });
	});
}

export function getTileCount(tileMap: TileMap) {
	let total = 0,
		visible = 0,
		maxLevel = 0,
		leaf = 0,
		downloading = 0;

	tileMap.rootTile.traverse((tile) => {
		if (tile.isTile) {
			total++;
			tile.isLeaf && tile.inFrustum && visible++;
			tile.isLeaf && leaf++;
			maxLevel = Math.max(maxLevel, tile.z);
			downloading = Tile.downloadThreads;
		}
	});
	return { total, visible, leaf, maxLevle: maxLevel, downLoading: downloading };
}

export function getAttributions(tileMap: TileMap) {
	const attributions: string[] = [];
	const imgSources = Array.isArray(tileMap.imgSource) ? tileMap.imgSource : [tileMap.imgSource];
	imgSources.forEach((source) => {
		const attr = source.attribution;
		attr && attributions.push(attr);
	});
	if (tileMap.demSource) {
		const attr = tileMap.demSource.attribution;
		attr && attributions.push(attr);
	}
	return [...new Set(attributions)];
}
