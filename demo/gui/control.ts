import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as tt from "../../src";

export const createControlGui = (gui: GUI, viewer: tt.plugin.GLViewer, map: tt.TileMap) => {
	const folder = gui.addFolder("Map control").close();
	folder.add(map.scale, "z", 1, 10, 0.1).name("Hight scale").listen();
	folder.add(map.position, "z", -5, 1, 0.01).name("Map Z").listen().listen();
	folder.add(map, "autoAdjustZ").name("Auto map Z");
	folder.add(viewer.controls.target, "z", -1, 1, 0.01).name("Control Z").listen();
	folder
		.add(viewer.controls, "maxPolarAngle", 0, Math.PI / 2, 0.1)
		.name("Polar limit")
		.listen();

	folder.add(viewer.controls, "enableDamping");
	folder.add(viewer.controls, "autoRotate");
	folder.add(map, "autoUpdate").name("Auto update tile tree");
	folder.add(map.rootTile, "visible").name("Map visible");
	folder.add(map, "dispose");

	return gui;
};
