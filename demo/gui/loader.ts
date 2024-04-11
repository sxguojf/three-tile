import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as tt from "../../src";

export const createLoaderGui = (gui: GUI, viewer: tt.plugin.GLViewer, map: tt.TileMap) => {
	const vm = {
		lon90: () => {
			map.centralMeridian = 90;
			viewer.controls.reset();
		},
		lon0: () => {
			map.centralMeridian = 0;
			viewer.controls.reset();
		},
		lon_90: () => {
			map.centralMeridian = -90;
			viewer.controls.reset();
		},
	};

	const folder = gui.addFolder("数据加载").close();
	folder.add(map, "loadCacheSize", 0, 3000).name("下载缓存大小(块)");
	folder.add(map, "viewerBufferSize", 1, 5, 0.1).name("视图缓冲区比例");
	folder.add(map, "LODThreshold", 0.5, 4, 0.01).name("LOD阈值");
	folder.add(map, "autoLoad", 0.5, 4, 0.01).name("自动加载数据");
	folder.add(map, "reload").name("重新加载数据");

	folder.add(vm, "lon90").name("亚洲(地图中心经度90°)");
	folder.add(vm, "lon0").name("欧洲(地图中心经度0°)");
	folder.add(vm, "lon_90").name("美洲(地图中心经度-90°)");

	return gui;
};
