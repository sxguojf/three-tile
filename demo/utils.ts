import { Mesh, MeshLambertMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader, Vector3 } from "three";
import * as tt from "../src";

// 创建地图背景图
/**
 * 效果补救2：
 * 为了降低资源占用，地图瓦片在不使用立即释放，需要显示再加载，加载过程会出现空白块，
 * 通过给地图下面增加一张静态图片补救。
 *
 * @param map 地图
 * @returns 背景图模型
 */
export function addMapBackground(map: tt.TileMap) {
	const backGround = new Mesh(
		new PlaneGeometry(),
		new MeshLambertMaterial({
			map: new TextureLoader().load("./image/tile0.png", (texture) => (texture.colorSpace = SRGBColorSpace)),
		}),
	);
	backGround.renderOrder = -1;
	backGround.name = "background";
	backGround.applyMatrix4(map.rootTile.matrix);
	backGround.translateZ(-2);
	map.add(backGround);

	return backGround;
}

/**
 * 限制摄像机进入地下
 * 计算摄像机视线与近剪裁面交点的距地面高度，太低则向天顶上移相机。
 * @param viewer 视图
 * @param map  地图
 * @param height 距地高度
 */
export function limitCameraHeight(viewer: tt.plugin.GLViewer, map: tt.TileMap, height = 0.1) {
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
			return 1;
		}
	}

	// viewer.controls.addEventListener("change", () => {
	viewer.addEventListener("update", () => {
		const h = getHightFromCamera();
		if (h < height) {
			const dv = map.localToWorld(map.up.clone()).multiplyScalar(height + 0.001 - h);
			viewer.camera.position.add(dv);
		}
	});
}
