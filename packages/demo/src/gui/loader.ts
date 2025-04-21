import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

export const createLoaderGui = (gui: GUI, viewer: plugin.GLViewer, map: tt.TileMap) => {
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
		export: () => {
			const exporter = new GLTFExporter();
			exporter.parse(
				map.rootTile,
				function (gltf) {
					if (gltf instanceof ArrayBuffer) {
						save(new Blob([gltf], { type: "application/octet-stream" }), "map.glb");
					}
				},
				function (error: ErrorEvent) {
					console.log("An error happened: " + error.message);
				},
				{
					trs: false,
					onlyVisible: true,
					binary: true,
					maxTextureSize: 1024,
				}
			);
		},
	};

	const folder = gui.addFolder("Data loader").close();
	// folder.add(map, "loadCacheSize", 0, 3000);
	folder.add(map, "LODThreshold", 0.5, 4, 0.01);
	folder.add(map, "reload");

	folder.add(vm, "lon90").name("Asia(MapCenterLon: 90°)");
	folder.add(vm, "lon0").name("Europe(MapCenterLon: 0°)");
	folder.add(vm, "lon_90").name("America(MapCenterLon: -90°)");
	folder.add(vm, "export").name("Export").name("Export map model");

	return gui;
};

function save(blob: Blob, filename: string) {
	const link = document.createElement("a");
	link.style.display = "none";
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	link.click();
}
