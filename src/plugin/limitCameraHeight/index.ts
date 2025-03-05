import { PerspectiveCamera, Raycaster, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { TileMap } from "../../map";

// 取得截面下沿射线
function getRayFromCameraNearPlane(camera: PerspectiveCamera) {
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

	// 创建射线
	const direction = new Vector3().subVectors(worldRightBottom, worldLeftBottom).normalize();
	const raycaster = new Raycaster(worldLeftBottom, direction);

	return raycaster;
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
	params.controls.addEventListener("change", () => {
		const raycaster = getRayFromCameraNearPlane(params.camera);
		// 判断近截面下沿是否与地图模型相交
		const intersects = raycaster.intersectObject(this, true);
		if (intersects.length > 0) {
			// console.log("射线与地图模型相交:", intersects);
			// 抬高摄像机
			const dv = this.localToWorld(this.up.clone()).multiplyScalar(0.05);
			params.camera.position.add(dv);
		}
	});
};
