import { PerspectiveCamera, Raycaster, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { TileMap } from "../../map";

// 取得近截面下沿的线段
function getLineSegmentFromCameraNearPlane(camera: PerspectiveCamera) {
	const near = camera.near;
	const fov = camera.fov * (Math.PI / 180); // 将角度转换为弧度
	const aspect = camera.aspect;
	const height = 2 * Math.tan(fov / 2) * near;
	const width = height * aspect;

	// 计算左下角和右下角的世界坐标
	const leftBottom = new Vector3(-width / 2, -height / 2, -near);
	const rightBottom = new Vector3(width / 2, -height / 2, -near);

	const worldLeftBottom = camera.localToWorld(leftBottom);
	const worldRightBottom = camera.localToWorld(rightBottom);

	return { worldLeftBottom, worldRightBottom };
}

export type LimitCameraHeightOptions = {
	camera: PerspectiveCamera;
	controls: MapControls;
};

declare module "../../map" {
	interface TileMap {
		limitCameraHeight(params: LimitCameraHeightOptions): void;
	}
}

TileMap.prototype.limitCameraHeight = function (params: LimitCameraHeightOptions) {
	const limit = () => {
		const { worldLeftBottom, worldRightBottom } = getLineSegmentFromCameraNearPlane(params.camera);

		// 创建从左下角到右下角的射线
		const direction = new Vector3().subVectors(worldRightBottom, worldLeftBottom).normalize();
		const raycaster = new Raycaster(worldLeftBottom, direction);

		// 判断近截面下沿是否与地图模型相交
		const intersects = raycaster.intersectObject(this, true);
		if (intersects.length > 0) {
			// 检查交点是否在线段内
			const intersection = intersects[0].point;
			const segmentLength = worldLeftBottom.distanceTo(worldRightBottom);
			const distanceToStart = worldLeftBottom.distanceTo(intersection);
			const distanceToEnd = worldRightBottom.distanceTo(intersection);

			if (distanceToStart + distanceToEnd <= segmentLength) {
				// console.log("线段与地图模型相交:", intersects);
				// 抬高摄像机
				const dv = this.localToWorld(this.up.clone()).multiplyScalar(0.05);
				params.camera.position.add(dv);
			}
		}
	};
	params.controls.addEventListener("change", limit);
	this.addEventListener("update", limit);
};
