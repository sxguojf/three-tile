import { Color, Mesh, MeshLambertMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, Vector3 } from "three";
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
export function createFakeEarth(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	const fakeEarth = new FakeEarth(viewer.scene.fog?.color || new Color(0));
	fakeEarth.name = "fakeearth";
	fakeEarth.applyMatrix4(map.rootTile.matrix);

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
export function createMapBackground(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	const backGround = new Mesh(
		new PlaneGeometry(),
		new MeshLambertMaterial({
			map: new TextureLoader().load(
				"../assets/image/tile0.png",
				(texture) => (texture.colorSpace = SRGBColorSpace),
			),
			transparent: true,
		}),
	);
	backGround.renderOrder = -1;
	backGround.name = "background";
	backGround.applyMatrix4(map.rootTile.matrix);

	// 当logarithmicDepthBuffer=true时，调整多边形偏移无效，所以直接调整背景Z坐标
	viewer.controls.addEventListener("change", () => {
		const dist = viewer.controls.getDistance();
		const dz = Math.min(Math.max(Math.log(dist) * 3, 0), 1);
		backGround.position.setZ(-(dz + 0.5));
	});

	return backGround;
}

/**
 * 限制摄像机高度，防止进入地下
 * @param viewer
 * @param map
 */
export function cameraHeightLimit(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	const dv = map.localToWorld(map.up.clone()).multiplyScalar(0.001);
	// 取得摄像机距地高度，检测点位于摄像机正前方0.1km
	const getZ = () => {
		// 取得摄像机前100米的高度
		const checkPoint = viewer.camera.localToWorld(new Vector3(0, -0.1, 0));
		const info = map.getLocalInfoFromWorld(checkPoint);
		if (info) {
			return map.worldToLocal(checkPoint).z - info.point.z;
		} else {
			return 10;
		}
	};

	viewer.controls.addEventListener("change", () => {
		// 如果检测点距地面高度较小，调整摄像机高度
		while (getZ() < 0.1) {
			viewer.camera.position.add(dv);
		}
	});
}
