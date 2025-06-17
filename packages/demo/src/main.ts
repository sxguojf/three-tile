import { REVISION } from "three";

import * as gui from "./gui";
import * as source from "./mapSource";

import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";
import { createGroundGroup, testTopMesh } from "./test";

// 注册加载器
function registerLoader() {
	//================================注册加载器====================================
	// 注册wrieframe加载器
	tt.registerImgLoader(new plugin.TileMaterialWrieLoader());
	// 注册瓦片调试加载器
	tt.registerImgLoader(new plugin.TileMaterialDebugeLoader());
	// 注册logo加载器
	tt.registerImgLoader(new plugin.TileMaterialLogoLoader());
	// 注册法向量图像加载器
	tt.registerImgLoader(new plugin.TileMateriaNormalLoader());
	// 注册GeoJSON加载器
	tt.registerImgLoader(new plugin.GeoJSONLoader());
	// 注册矢量瓦片MVT加载器
	tt.registerImgLoader(new plugin.MVTLoader());
	// 注册单影像加载器
	tt.registerImgLoader(new plugin.SingleImageLoader());
	// 注册单影像TIF-DEM加载器
	tt.registerDEMLoader(new plugin.SingleTifDEMLoader());
	//===============================================================================

	// 取得影像加载器
	// const imgLoader = tt.getImgLoader<tt.TileImageLoader>("image");
	// // 设置影像加载器的材质
	// imgLoader.material = new MeshLambertMaterial({ color: 0x5555ff });

	// 启用indexDB缓存
	// plugin.IndexDBCacheEable();

	console.log("======================================================");
	console.log(`threejs V${REVISION}`);
	console.log(`three-tile V${tt.version}, ${tt.author.email}`);
	document.querySelector<HTMLSpanElement>("#version")!.innerText = tt.version;
	console.log("======================================================");
	const loaders = tt.getTileLoaders();
	console.log("瓦片加载器列表:");
	loaders.imgLoaders.forEach(loader => {
		console.log(`* 影像加载器: '${loader.dataType}' Author: '${loader.info.author}'`);
	});
	loaders.demLoaders.forEach(loader => {
		console.log(`* 地形加载器: '${loader.dataType}', Author: '${loader.info.author}'`);
	});
	console.log("======================================================");
}

// 创建地图
function createMap() {
	// 影像数据源
	const imgSource = [source.arcGisImgSource, source.arcGisCiaSource];
	// 地形数据源
	const demSource = source.arcGisDemSource;

	// 创建地图对象
	const map = new tt.TileMap({
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
		// 调试标志
		debug: 1,
	});

	// 地图旋转到xz平面
	map.rotateX(-Math.PI / 2);

	// 地图准备就绪
	map.addEventListener("ready", () => console.log("Map ready!!!!!!"));

	return map;
}

// 初始化三维场景
function initViewer(id: string, map: tt.TileMap) {
	// 初始化场景
	const viewer = new plugin.GLViewer(id);
	// 地图添加到场景
	viewer.scene.add(map);

	// 填加伪球体
	const frakeEarth = plugin.createFrakEarth(map, 0x11111);
	map.add(frakeEarth);
	map.addEventListener("update", () => {
		frakeEarth.visible = viewer.controls.getDistance() > 5e5 && viewer.controls.getPolarAngle() < Math.PI / 2;
	});

	// 添加罗盘
	const compass = plugin.createCompass(viewer.controls);
	document.querySelector("#compass-container")?.appendChild(compass.dom);

	// 防止摄像机进入地下
	viewer.controls.addEventListener("change", () => plugin.limitCameraHeight(map, viewer.camera));
	map.addEventListener("tile-loaded", () => plugin.limitCameraHeight(map, viewer.camera));
	return viewer;
}

// 初始化GUI
function initGui(viewer: plugin.GLViewer, map: tt.TileMap) {
	// 初始化配置项
	gui.initGui(viewer, map);
	// 添加状态指示器
	gui.addStats(viewer);
	// 状态栏显示瓦片加载状态
	gui.showLoading(map);
	// 状态栏显示鼠标位置经纬度高度信息
	gui.showLocation(viewer, map);
	// 显示版权信息
	gui.showAttribution(map);
	// 显示调试信息
	gui.showDebug(map, viewer);
	// 显示鼠标点击的瓦片信息-调试
	gui.showClickedTile(viewer, map);
}

// 动画漫游指定位置
// function fly(viewer: plugin.GLViewer, map: tt.TileMap) {
// 	// 地图中心坐标(经度，纬度，高度)
// 	const centerGeo = new Vector3(110, 35, 0);
// 	// 摄像坐标(经度，纬度，高度)
// 	const camersGeo = new Vector3(110, 15, 4000 * 1000);
// 	// 地图中心经纬度高度转为世界坐标
// 	const centerPosition = map.geo2world(centerGeo);
// 	// 摄像经纬度高度转为世界坐标
// 	const cmaeraPosition = map.geo2world(camersGeo);
// 	viewer.controls.enabled = false;
// 	// 飞到指定位置
// 	viewer.flyTo(centerPosition, cmaeraPosition, true, () => {
// 		viewer.controls.enabled = true;
// 	});
// }

function main() {
	// 注册加载器
	registerLoader();
	// 创建地图
	const map = createMap();
	// 创建视图
	const viewer = initViewer("#map", map);
	// 初始化GUI
	initGui(viewer, map);
	// 摄像机动画移动到3000高度
	// fly(viewer, map);
	// 测试
	// testTopMesh(viewer, map);
	// testHole(viewer, map);
	// testTileHelperBox(map);
	// goHome(viewer, map);

	// viewer.container?.addEventListener("pointerdown", evt => {
	// 	const info = plugin.getLocalFromMouse(evt, map, viewer.camera);
	// 	if (info) {
	// 		addIcon(map, info);
	// 	}
	// });
	// createGroundGroup(map);
}

main();
