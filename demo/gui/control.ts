import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as tt from "../../src";

export const createControlGui = (gui: GUI, viewer: tt.plugin.GLViewer, map: tt.TileMap) => {
	const folder = gui.addFolder("Map control").close();
	folder.add(map.scale, "z", 1, 10, 0.1).name("Hight scale").listen();
	// folder.add(viewer.controls.target, "y", -1, 1, 0.01).name("Controls").listen();
	folder.add(map.position, "y", -5, 5, 0.01).name("Map Y").listen();
	folder.add(map, "autoPosition");
	folder.add(viewer.controls, "maxPolarAngle", 0, Math.PI / 2, 0.1).listen();
	folder.add(viewer.controls, "enableDamping");
	folder.add(viewer.controls, "autoRotate");
	folder.add(map, "autoUpdate");
	folder.add(map, "enableUnderground");
	folder.add(map.rootTile, "visible");
	folder.add(map, "dispose");

	return gui;
};
