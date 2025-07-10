import {
	BufferGeometry,
	Camera,
	MathUtils,
	Mesh,
	MeshLambertMaterial,
	Object3D,
	PerspectiveCamera,
	Raycaster,
	SphereGeometry,
	Vector3,
} from "three";
import { TileMap, findFirstIntersect } from "three-tile";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const tempRay = new Raycaster();
/**
 * 防止摄像机碰撞或穿过地面
 * @param map - 地图实例
 * @param camera - 摄像机
 * @param limitHeight - 摄像机与地面的最小高度差，默认为 10。
 * @returns 摄像机是否碰撞地面。
 */
export function limitCameraHeight(map: TileMap, camera: PerspectiveCamera, limitHeight = 10) {
	camera.updateMatrixWorld();

	// 摄像机高度>10000米时不检测
	if (camera.position.y > 10000) {
		return false;
	}

	// 摄像机是否碰撞地面
	let hit = false;

	// 计算测试点坐标
	const height = 2 * camera.near * Math.tan(MathUtils.degToRad(camera.fov) / 2); // 近截面高度
	const checkPoint = new Vector3(0, -height / 2, -camera.near - height / 10); // 近截面下沿中点为碰撞检查点
	checkPoint.applyMatrix4(camera.matrixWorld); // 转为世界坐标

	// 获取检测点下方的地面信息
	const info = map.getLocalInfoFromWorld(checkPoint);

	if (info) {
		// 计算检测点与地面的高度差
		const dh = checkPoint.y - info.point.y;
		// 当高度差小于限制高度时，抬高摄像机
		if (dh < limitHeight) {
			// 计算需要抬高的偏移量，乘以 1.01 是为了留出一定的安全余量
			const offset = (limitHeight - dh) * 1.01;
			// 将偏移量转换为世界坐标系下的向量
			const dv = map.localToWorld(map.up.clone().multiplyScalar(offset));
			// 抬高摄像机的位置
			camera.position.add(dv);
			hit = true;
		}
	}

	// 当地图处于调试模式时，添加一个球体作为测试标记
	if (map.debug > 0) {
		let pointMesh = map.getObjectByName("checkPoint");
		if (!pointMesh) {
			pointMesh = new Mesh<BufferGeometry, MeshLambertMaterial>(
				new SphereGeometry(1),
				new MeshLambertMaterial({ color: 0x00ff00 })
			);
			pointMesh.name = "checkPoint";
			map.add(pointMesh);
		}
		// 球坐标设置为检查点位置
		pointMesh.position.copy(map.worldToLocal(checkPoint));
		// 球大小设置为屏幕高度的1/50
		pointMesh.scale.setScalar(height / 50);
		if (pointMesh instanceof Mesh) {
			pointMesh.material.color.set(hit ? 0xf00f00 : 0x00ff00);
			hit && console.log("Hit ground");
		}
	}

	return hit;
}

/**
 * 根据观察者距模型（地面）距离调整缩放速度
 * @param model 模型，传入TileMap，根据TileMap及其子模型距离调整缩放速度，传入TileMap.root，根据地面距离调整缩放速度
 * @param camera 摄像机
 * @param controls 控制器
 * @param speed {
 *          factor 缩放系数，值越大缩放越快，默认1.0
 *          minSpeed 最小速度，默认0.2
 *          maxSpeed 最大速度，默认10
 *       }
 */
export function adjustZoomSpeedFromDist(
	model: Object3D,
	camera: Camera,
	controls: OrbitControls,
	speed: {
		factor?: number;
		minSpeed?: number;
		maxSpeed?: number;
	} = {
		factor: 1.0,
		minSpeed: 0.1,
		maxSpeed: 10,
	}
) {
	const { factor = 1.0, minSpeed = 0.1, maxSpeed = 10 } = speed;
	// 视线方向射线
	tempRay.set(camera.position, camera.getWorldDirection(new Vector3()));
	const intersect = findFirstIntersect(tempRay, model);
	if (intersect) {
		// / 根据摄像机与地面距离调整缩放速度
		const speed = Math.log((intersect.distance / 300) * factor);
		controls.zoomSpeed = MathUtils.clamp(speed, minSpeed, maxSpeed);
	}

	// // 取得视线与地面交点
	// const intersects = ray.intersectObject<Mesh>(model, true);
	// if (intersects.length > 0) {
	// 	// 根据摄像机与地面距离调整缩放速度
	// 	const speed = Math.log((intersects[0].distance / 300) * factor);
	// 	controls.zoomSpeed = MathUtils.clamp(speed, minSpeed, maxSpeed);
	// }
}
