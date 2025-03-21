import { PerspectiveCamera, Vector3 } from "three";
import { TileMap } from "../tt";

export type LimitCameraHeightParams = {
	camera: PerspectiveCamera; // 摄像机
	limitHeight?: number; //限制高度
};

export function limitCameraHeight(map: TileMap, camera: PerspectiveCamera, limitHeight = 0.1) {
	// 摄像机方向与近截面交点的世界坐标
	const checkPoint = camera.localToWorld(new Vector3(0, 0, -camera.near - 0.1));
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
