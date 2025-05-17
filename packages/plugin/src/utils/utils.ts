import { Camera, PerspectiveCamera, Vector2, Vector3 } from "three";
import { TileMap } from "three-tile";

export function getLocalFromMouse(
	mouseEvent: { currentTarget: any; clientX: number; clientY: number },
	map: TileMap,
	camera: Camera
): Vector3 | undefined {
	const { currentTarget: target, clientX: x, clientY: y } = mouseEvent;
	if (target instanceof HTMLElement) {
		const width = target.clientWidth;
		const height = target.clientHeight;
		const pointer = new Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1);
		const info = map.getLocalInfoFromScreen(camera, pointer);
		return info?.location;
	} else {
		return undefined;
	}
}

export function getAttributions(map: TileMap) {
	const attributions = new Set<string>();
	const imgSources = Array.isArray(map.imgSource) ? map.imgSource : [map.imgSource];
	imgSources.forEach(source => {
		const attr = source.attribution;
		attr && attributions.add(attr);
	});
	if (map.demSource) {
		const attr = map.demSource.attribution;
		attr && attributions.add(attr);
	}
	return Array.from(attributions);
}

export type LimitCameraHeightParams = {
	camera: PerspectiveCamera; // 摄像机
	limitHeight?: number; //限制高度
};

export function limitCameraHeight(map: TileMap, camera: PerspectiveCamera, limitHeight = 100) {
	// 摄像机方向与近截面交点的世界坐标
	const checkPoint = camera.localToWorld(new Vector3(0, 0, -camera.near - 100));

	// 取该点下方的地面高度
	const info = map.getLocalInfoFromWorld(checkPoint);
	if (info) {
		// 地面高度与该点高度差(世界坐标系下)
		const h = checkPoint.y - info.point.y;
		// 距离低于限制高度时，沿天顶方向抬高摄像机
		if (h < limitHeight) {
			const offset = h < 0 ? -h * 1.1 : h / 10;
			const dv = map.localToWorld(map.up.clone()).multiplyScalar(offset);
			camera.position.add(dv);
			return true;
		}
	}
	return false;
}
