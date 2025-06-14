import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

export const createMapOptionsGui = (gui: GUI, viewer: plugin.GLViewer, map: tt.TileMap) => {
	const folder = gui.addFolder("地图设置").close();
	folder.add(viewer, "controlsMode", { 地图控制器: "MAP", 轨道控制器: "ORBIT" }).name("控制器");

	folder.add(map, "autoUpdate").name("地图自动更新");
	folder
		.add(viewer.camera, "fov", 30, 120)
		.onChange(() => viewer.camera.updateProjectionMatrix())
		.name("视场角FOV");

	folder.add(map.scale, "z", 1, 50, 0.1).name("地形夸张").listen();
	// folder.add(viewer.controls.target, "y", -1, 1, 0.01).name("Controls").listen();
	folder.add(map.position, "y", -5000, 1000, 1).name("地图偏移").listen();
	// folder.add(map, "autoPosition");
	folder
		.add(viewer.controls, "maxPolarAngle", 0, Math.PI / 2, 0.1)
		.name("最大倾角")
		.listen();
	folder.add(viewer.controls, "autoRotate").name("自动旋转");
	folder.add(map.rootTile, "visible").name("地图显示/隐藏").listen();
	folder.add(map, "dispose").name("地图销毁");

	return gui;
};
