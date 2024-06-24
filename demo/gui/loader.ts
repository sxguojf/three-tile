import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as tt from "../../src";

export const createLoaderGui = (gui: GUI, viewer: tt.plugin.GLViewer, map: tt.TileMap) => {
	const vm = {
		lon90: () => {
			map.lon0 = 90;
			viewer.controls.reset();
		},
		lon0: () => {
			map.lon0 = 0;
			viewer.controls.reset();
		},
		lon_90: () => {
			map.lon0 = -90;
			viewer.controls.reset();
		},
	};

	const folder = gui.addFolder("Data loader").close();
	folder.add(map, "loadCacheSize", 0, 3000).name("Download cache size");
	folder.add(map, "viewerBufferSize", 1, 5, 0.1).name("Render cache size");
	folder.add(map, "LODThreshold", 0.5, 4, 0.01).name("LOD threshold");
	folder.add(map, "autoLoad", 0.5, 4, 0.01).name("Auto load");
	folder.add(map, "reload");

	folder.add(vm, "lon90").name("Asia(MapCenterLon: 90°)");
	folder.add(vm, "lon0").name("Europe(MapCenterLon: 0°)");
	folder.add(vm, "lon_90").name("America(MapCenterLon: -90°)");

	return gui;
};
