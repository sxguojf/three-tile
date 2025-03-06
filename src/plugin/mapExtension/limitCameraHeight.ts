import { Vector3 } from "three";
import { LimitCameraHeightParams } from ".";
import { TileMap } from "../../map";

TileMap.prototype.limitCameraHeight = function (params: LimitCameraHeightParams) {
	const { camera, limitHeight = 0.1 } = params;
	// 摄像机方向与近截面交点的世界坐标
	const checkPoint = camera.localToWorld(new Vector3(0, 0, -camera.near - 0.1));
	// 取该点下方的地面高度
	const info = this.getLocalInfoFromWorld(checkPoint);
	if (info) {
		// 地面高度与该点高度差(世界坐标系下)
		const h = checkPoint.y - info.point.y;
		// 距离低于限制高度时，沿天顶方向抬高摄像机
		if (h < limitHeight) {
			const offset = h < 0 ? -h * 1.1 : h / 10;
			const dv = this.localToWorld(this.up.clone()).multiplyScalar(offset);
			camera.position.add(dv);
			return true;
		}
	}
	return false;
};
