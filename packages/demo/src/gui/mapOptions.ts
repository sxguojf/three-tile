import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

export const createMapOptionsGui = (gui: GUI, viewer: plugin.GLViewer, map: tt.TileMap) => {
	const folder = gui.addFolder("Map Options").close();
	folder.add(map, "autoUpdate");
	folder.add(map.scale, "z", 1, 50, 0.1).name("Hight scale").listen();
	// folder.add(viewer.controls.target, "y", -1, 1, 0.01).name("Controls").listen();
	folder.add(map.position, "y", -5000, 1000, 1).name("Map Y").listen();
	// folder.add(map, "autoPosition");
	folder.add(viewer.controls, "maxPolarAngle", 0, Math.PI / 2, 0.1).listen();
	folder.add(viewer.controls, "autoRotate");
	folder.add(map.rootTile, "visible").listen();
	folder.add(map, "dispose");

	return gui;
};
