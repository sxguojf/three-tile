import {
	BufferGeometry,
	Camera,
	MathUtils,
	Mesh,
	MeshLambertMaterial,
	PerspectiveCamera,
	SphereGeometry,
	Vector2,
	Vector3,
} from "three";
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

export function limitCameraHeight(map: TileMap, camera: PerspectiveCamera, limitHeight = 10) {
	camera.updateMatrixWorld();
	// // 计算近截面下沿中点
	const height = 2 * camera.near * Math.tan(MathUtils.degToRad(camera.fov) / 2); // 屏幕高度(摄像机坐标系)
	const checkPoint = new Vector3(0, -height / 2, -camera.near - height / 10); // 检测点坐标（摄像机坐标）
	checkPoint.applyMatrix4(camera.matrixWorld); // 转换世界坐标
	// 取该点下方的地面高度
	const info = map.getLocalInfoFromWorld(checkPoint);

	let hit = false;
	if (info) {
		// 地面高度与该点高度差(世界坐标系下)
		const dh = checkPoint.y - info.point.y;
		// 地面高度低于限制高度时，沿天顶方向抬高摄像机
		if (dh < limitHeight) {
			const offset = (limitHeight - dh) * 1.01;
			const dv = map.localToWorld(map.up.clone().multiplyScalar(offset));
			camera.position.add(dv);
			hit = true;
			if (map.debug > 0) {
				console.log("Hit ground ", dh);
			}
		}
	}

	// 添加一个球做测试
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
		pointMesh.position.copy(map.worldToLocal(checkPoint));
		pointMesh.scale.setScalar(height / 50);
		if (pointMesh instanceof Mesh) {
			pointMesh.material.color.set(hit ? 0xf00f00 : 0x00ff00);
		}
	}

	return hit;
}
