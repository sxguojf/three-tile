import { Vector2 } from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

import * as tt from "../../src";
import { createCameraGui } from "./camera";
import { createControlGui } from "./control";
import { createEnvironmentGui } from "./environment";
import { createLoaderGui } from "./loader";
import { createSourceGui } from "./source";
export { showDebug } from "./debug";
export { showCompass } from "./compass";

export function initGui(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	const gui = new GUI();
	// 数据源
	createSourceGui(gui, viewer, map);
	// 地图控制
	createControlGui(gui, viewer, map);
	// 加载器
	createLoaderGui(gui, viewer, map);
	// 环境控制
	createEnvironmentGui(gui, viewer);
	// 摄像机控制
	createCameraGui(gui, viewer, map);
}

// 状态栏显示地图数据下载状态
export function showLoading(map: tt.TileMap) {
	const loading = document.querySelector<HTMLDivElement>("#loading");
	if (loading) {
		map.addEventListener("loading-start", (evt) => {
			loading.innerHTML = "Started: " + evt.itemsLoaded + " of " + evt.itemsTotal + " files.";
		});
		map.addEventListener("loading-progress", (evt) => {
			loading.innerHTML = "Loading: " + evt.itemsLoaded + " of " + evt.itemsTotal + " files.";
		});
		map.addEventListener("loading-complete", () => {
			loading.innerHTML = "Loading complete!";
			loading.style.backgroundColor = "";
		});
		map.addEventListener("loading-error", (url) => {
			loading.innerHTML = "There was an error loading " + url;
			loading.style.backgroundColor = "red";
		});
	}
	map.addEventListener("tile-load-error", (evt) => {
		console.error(`${evt.message}:  ${evt.tile.name}`);
	});
}

// 添加地图版权信息
export function showAttribution(map: tt.TileMap) {
	const show = () => {
		const dom = document.querySelector("#attribution");
		if (dom) {
			dom.innerHTML = "© " + map.attributions.join(" | © ");
		}
	};
	map.addEventListener("source-changed", () => show());
	show();
}

// 添加性能监视器
export function addStats(viewer: tt.plugin.GLViewer) {
	const stats = new Stats();
	stats.dom.style.left = "";
	stats.dom.style.top = "";
	stats.dom.style.right = "0";
	stats.dom.style.bottom = "30px";
	stats.dom.style.zIndex = "10000";
	stats.showPanel(0);

	document.body.appendChild(stats.dom);
	viewer.addEventListener("update", () => stats.update());
}

// 状态栏显示地理位置信息
export function showLocation(viewer: tt.plugin.GLViewer, map: tt.TileMap): void {
	const pointer = new Vector2();
	viewer.container.addEventListener("pointermove", (evt) => {
		pointer.x = (evt.clientX / viewer.renderer.domElement.clientWidth) * 2 - 1;
		pointer.y = -(evt.clientY / viewer.renderer.domElement.clientHeight) * 2 + 1;

		const info = map.getLocalInfoFromScreen(viewer.camera, pointer);
		if (info) {
			const dom = document.querySelector("#location")!;
			if (dom) {
				const lonlat = info?.location;
				dom.innerHTML = `${lonlat.x.toFixed(6)}°E, 
                    ${lonlat.y.toFixed(6)}°N, ${(lonlat.z * 1000).toFixed(0)}m, (${info.normal?.x.toFixed(
					2,
				)}, ${info.normal?.y.toFixed(2)}, ${info.normal?.z.toFixed(2)})`;
			}
		}
	});
}

// 显示鼠标点击处瓦片
export function showClickedTile(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	viewer.container.addEventListener("click", (evt) => {
		const pointer = new Vector2();
		pointer.x = (evt.clientX / viewer.renderer.domElement.clientWidth) * 2 - 1;
		pointer.y = -(evt.clientY / viewer.renderer.domElement.clientHeight) * 2 + 1;
		// 取得鼠标点击处的经纬度高度
		const info = map.getLocalInfoFromScreen(viewer.camera, pointer);
		// getScreenPointInfo(viewer, map, pointer);
		if (info) {
			console.log(info);
		}
	});
}
