import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as tt from "../../src";

export const createControlGui = (gui: GUI, viewer: tt.plugin.GLViewer, map: tt.TileMap) => {
	const folder = gui.addFolder("地图控制").close();
	folder.add(map.scale, "z", 1, 10, 0.1).name("地图高度拉伸倍数").listen();
	folder.add(map.position, "z", -5, 1, 0.01).name("地图Z坐标").listen().listen();
	folder.add(map, "autoAdjustZ").name("地图Z坐标自动调整");
	folder.add(viewer.controls.target, "z", -1, 1, 0.01).name("控制器Z坐标").listen();
	folder
		.add(viewer.controls, "maxPolarAngle", 0, Math.PI / 2, 0.1)
		.name("倾角限制")
		.listen();

	folder.add(viewer.controls, "enableDamping").name("惯性阻尼控制");
	folder.add(viewer.controls, "autoRotate").name("自动旋转");
	folder.add(map, "autoUpdate").name("自动更新瓦片树");
	folder.add(map.rootTile, "visible").name("地图显示/隐藏");
	folder.add(map, "dispose").name("释放地图");

	return gui;
};
