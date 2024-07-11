import {
	Color,
	MathUtils,
	Mesh,
	MeshLambertMaterial,
	PlaneGeometry,
	SRGBColorSpace,
	TextureLoader,
	Vector3,
} from "three";
import * as tt from "../src";
import { FakeEarth } from "../src/plugin/fakeEarth";

/**
 * 效果补救1：
 * three-tile的地图并不是以球体为基础模型的，它的地图是投影到平面上的，不是球体
 * 影响三维观感，补救措施是在平面地图上加一层圆形遮罩，地图缩小后感觉是一个球。
 *
 * @param viewer 视图
 * @param map  地图
 * @returns 地球遮罩模型
 */
export function addFakeEarth(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	const fakeEarth = new FakeEarth(viewer.scene.fog?.color || new Color(0));
	fakeEarth.name = "fakeearth";
	fakeEarth.applyMatrix4(map.rootTile.matrix);
	map.add(fakeEarth);

	viewer.controls.addEventListener("change", () => {
		// 地图距摄像机较远时再显示遮罩
		fakeEarth.visible = viewer.controls.getDistance() > 3000;
	});

	return fakeEarth;
}

// 创建地图背景图
/**
 * 效果补救2：
 * 为了降低资源占用，地图瓦片在不使用立即释放，需要显示再加载，加载过程会出现空白块，
 * 通过给地图下面增加一张静态图片补救。
 *
 * @param map 地图
 * @returns 背景图模型
 */
export function addMapBackground(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	const backGround = new Mesh(
		new PlaneGeometry(),
		new MeshLambertMaterial({
			map: new TextureLoader().load("./image/tile0.png", (texture) => (texture.colorSpace = SRGBColorSpace)),
			transparent: true,
		}),
	);
	backGround.renderOrder = -1;
	backGround.name = "background";
	backGround.applyMatrix4(map.rootTile.matrix);
	map.add(backGround);

	// 当logarithmicDepthBuffer=true时，调整多边形偏移无效，所以直接调整背景Z坐标
	viewer.controls.addEventListener("change", () => {
		const dist = viewer.controls.getDistance();
		const dz = MathUtils.clamp(Math.log(dist) * 3, 0, 1);
		backGround.position.setZ(-(dz + 0.5));
	});

	return backGround;
}

/**
 * 限制摄像机进入地下
 * 计算摄像机视线与近剪裁面交点的距地面高度，太低则向天顶上移相机。
 * @param viewer 视图
 * @param map  地图
 */
export function limitCameraHeight(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	function getHightFromCamera() {
		// 取摄像机下方点
		const dist = viewer.camera.near;
		const checkPoint = viewer.camera.localToWorld(new Vector3(0, 0, -dist));
		// 取该点下方的地面高度
		const info = map.getLocalInfoFromWorld(checkPoint);
		if (info) {
			// 地面高度与摄像机高度差
			return map.worldToLocal(checkPoint).z - map.worldToLocal(info.point).z;
		} else {
			return 10;
		}
	}

	viewer.controls.addEventListener("change", () => {
		const h = getHightFromCamera();
		if (h < 0.2) {
			const dv = map.localToWorld(map.up.clone()).multiplyScalar(0.201 - h);
			viewer.camera.position.add(dv);
		}
	});
}
