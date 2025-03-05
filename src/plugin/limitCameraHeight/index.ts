import { PerspectiveCamera, Vector3 } from "three";
import { TileMap } from "../../map";

export type LimitCameraHeightOptions = {
	camera: PerspectiveCamera; // 摄像机
	limitHeight?: number; //限制高度
};

declare module "../../map" {
	interface TileMap {
		/**
		 * 限制摄像机高度，需要在场景每帧更新中调用
		 * @param params
		 */
		limitCameraHeight(params: LimitCameraHeightOptions): void;
	}
}

TileMap.prototype.limitCameraHeight = function (params: LimitCameraHeightOptions) {
	const { camera, limitHeight = 0.1 } = params;

	const getCameraNearHeight = () => {
		// 摄像机方向与近截面交点的世界坐标
		const checkPoint = camera.localToWorld(new Vector3(0, 0, -camera.near - 0.2));
		// 取该点下方的地面高度
		const info = this.getLocalInfoFromWorld(checkPoint);
		if (info) {
			// 地面高度与该点高度差(世界坐标系下)
			return checkPoint.y - info.point.y;
		} else {
			return Infinity;
		}
	};
	// 计算摄像机(near)距地面距离
	const dist = getCameraNearHeight();
	// 距离限制高度是时，抬高摄像机
	if (dist < limitHeight) {
		const dv = this.localToWorld(this.up.clone()).multiplyScalar(limitHeight / 20);
		camera.position.add(dv);
	}
};
