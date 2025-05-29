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
	// 计算近截面下沿中点（相机局部坐标系）
	const height = 2 * camera.near * Math.tan(MathUtils.degToRad(camera.fov) / 2);
	const localPoint = new Vector3(0, -height / 2, -camera.near - height / 10); // 局部坐标
	const checkPoint = localPoint.applyMatrix4(camera.matrixWorld); // 转换为世界坐标系

	// 取该点下方的地面高度
	const info = map.getLocalInfoFromWorld(checkPoint);

	let hit = false;

	if (info) {
		// 地面高度与该点高度差(世界坐标系下)
		const h = checkPoint.y - info.point.y;
		// 距离低于限制高度时，沿天顶方向抬高摄像机
		if (h < limitHeight) {
			const offset = h < 0 ? -h * 1.1 : h / 20;
			const dv = map.localToWorld(map.up.clone()).multiplyScalar(offset);
			camera.position.add(dv);
			hit = true;
		}
	}

	// 添加一个球做测试
	if (map.loader.debug > 0) {
		let pointMesh = map.getObjectByName("checkPoint");
		if (!pointMesh) {
			pointMesh = new Mesh<BufferGeometry, MeshLambertMaterial>(
				new SphereGeometry(1),
				new MeshLambertMaterial({ color: 0xff0000 })
			);
			pointMesh.name = "checkPoint";
			map.add(pointMesh);
		}
		pointMesh.position.copy(map.worldToLocal(localPoint));
		pointMesh.scale.setScalar(height / 50);
	}

	return hit;
}
