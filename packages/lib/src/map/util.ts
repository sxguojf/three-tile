/**
 *@description: Map function
 *@author: 郭江峰
 *@date: 2024-04-08
 */

import { Camera, CanvasTexture, Intersection, Mesh, Raycaster, Sprite, SpriteMaterial, Vector2, Vector3 } from "three";
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
	const intersects = ray.intersectObjects<Mesh>([map.rootTile]);
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
	// // 原点（高空10000m）
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

// export function goHome(map: TileMap, viewer: GLViewer) {
// 	// 按下 F1 键事件
// 	window.addEventListener("keydown", (event) => {
// 		if (event.key === "F1") {
// 			event.preventDefault();
// 			if (!map.getObjectByName("boards")) {
// 				// open("https://github.com/sxguojf/three-tile");
// 				const boards = createBillboards("three-tile");
// 				boards.name = "boards";
// 				map.add(boards);

// 				map.addEventListener("loading-complete", () => {
// 					const info = map.getLocalInfoFromGeo(lonlat);
// 					if (info) {
// 						// boards.visible = (info.object as Tile).z > 10;
// 						boards.visible = true;
// 						const pos = map.geo2map(info.location);
// 						boards.position.copy(pos);
// 					}
// 				});
// 			}
// 			const lonlat = new Vector3(108.94236, 34.2855, 0);
// 			const centerPosition = map.geo2world(lonlat);
// 			const cameraPosition = centerPosition.clone().add(new Vector3(-1, 2, 0));
// 			viewer.flyTo(centerPosition, cameraPosition);
// 		}
// 	});
// }

function drawBillboards(txt: string, size: number = 128) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Failed to get canvas context");
	}

	canvas.width = size;
	canvas.height = size;
	const centerX = size / 2;
	const centerY = size / 2;

	ctx.imageSmoothingEnabled = false;
	ctx.fillStyle = "#000022";
	ctx.strokeStyle = "DarkGoldenrod";

	ctx.lineWidth = 5;
	ctx.moveTo(centerX, 3);
	ctx.lineTo(centerX, size);
	ctx.stroke();
	ctx.closePath();

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.roundRect(2, 2, size - 4, centerY - 8, 10);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.font = "24px Arial";
	ctx.fillStyle = "Goldenrod";
	ctx.strokeStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	ctx.strokeText(txt, centerX, 20);
	ctx.fillText(txt, centerX, 20);

	return canvas;
}

export function createBillboards(txt: string, size = 128) {
	const boardTexture = new CanvasTexture(drawBillboards(txt, size));
	const boardsMaterial = new SpriteMaterial({
		map: boardTexture,
		sizeAttenuation: false,
	});
	const boards = new Sprite(boardsMaterial);
	boards.visible = false;
	boards.center.set(0.5, 0.3);
	boards.scale.setScalar(0.11);
	boards.renderOrder = 999;
	return boards;
}
