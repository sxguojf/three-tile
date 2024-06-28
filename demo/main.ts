import { Vector3 } from "three";
import TWEEN, { Tween } from "three/examples/jsm/libs/tween.module.js";
import * as tt from "../src";
import * as gui from "./gui";
import * as source from "./mapSource";
import { cameraHeightLimit, createFakeEarth, createMapBackground } from "./utils";

console.log(`three-tile V${tt.version}, ${tt.author.name}`);

// 创建地图
function createMap() {
	// 影像数据源
	const imgSource = [source.arcGisSource, source.arcGisCiaSource]; //, source.tdtCiaSource_w
	// 地形数据源
	const demSource = source.mapBoxDemSource;

	// 创建地图对象
	return tt.TileMap.create({
		// 影像数据源
		imgSource: imgSource,
		// 高程数据源
		demSource: demSource,
		// 地图投影中央经线经度
		lon0: 90,
		// 最小缩放级别
		minLevel: 2,
		// 最大缩放级别
		maxLevel: 20,
	});
}

// threejs 场景初始化
function initViewer(map: tt.TileMap, dom: HTMLElement) {
	// 地图中心经纬度
	// const centerGeo = new Vector3(108.942, 34.2855, 0);
	const centerGeo = new Vector3(110, 30, 0);
	// 经纬度转为世界坐标
	const centerPos = map.localToWorld(map.geo2pos(centerGeo));
	// 初始化三维场景
	const viewer = new tt.plugin.GLViewer(
		dom, // 地图容器
		centerPos, // 地图中心坐标
		centerPos.clone().add(new Vector3(0, -4000, 30000)), // 摄像机坐标
	);
	// 地图添加到场景
	viewer.scene.add(map);

	// const helper = new AxesHelper(6e4);
	// viewer.scene.add(helper);

	return viewer;
}

// 初始化GUI
function initGui(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
	// 添加状态指示器
	gui.addStats(viewer);
	// 初始化配置项
	gui.initGui(viewer, map);
	// 状态栏显示瓦片加载状态
	gui.updateLoading(map);
	// 状态栏显示鼠标位置经纬度高度信息
	gui.showLocation(viewer, map);
	// 显示版权信息
	gui.updateAttribution(map);
	// 测试取得指定经纬度的海拔高度
	gui.showClickedTile(viewer, map);
	// 显示调试信息
	gui.updateDebug(map, viewer);
	// 显示罗盘
	gui.updateCompass(viewer);
}

// 动画漫游到h高度
function flyTo(viewer: tt.plugin.GLViewer, h: number) {
	const tween = new Tween(viewer.camera.position);
	tween.to(viewer.camera.position.clone().setZ(h)).start();
}

addEventListener("load", () => {
	// 创建地图
	const map = createMap();

	// 创建视图
	const mapDom = document.querySelector<HTMLElement>("#map");
	if (!mapDom) {
		console.error("Can not found ");
		return;
	}
	const viewer = initViewer(map, mapDom);

	// 每帧更新TWEEN
	viewer.addEventListener("update", () => TWEEN.update());

	// 添加地图背景图
	map.add(createMapBackground(viewer, map));

	// 添加伪地球遮罩
	map.add(createFakeEarth(viewer, map));

	// 防止摄像机钻到地面以下
	cameraHeightLimit(viewer, map);

	// 创建gui
	initGui(viewer, map);

	// 动画漫游到4000km高空
	flyTo(viewer, 4000);
});
