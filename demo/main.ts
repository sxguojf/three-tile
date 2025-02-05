import { BufferGeometry, ColorRepresentation, Line, LineBasicMaterial, Vector3 } from "three";
import TWEEN, { Tween } from "three/examples/jsm/libs/tween.module.js";
import * as tt from "../src";
import * as gui from "./gui";
import * as source from "./mapSource";
import { addFakeEarth, addMapBackground, limitCameraHeight } from "./utils";

console.log(`three-tile V${tt.version}, ${tt.author.name}`);
document.querySelector<HTMLSpanElement>("#version")!.innerText = tt.version;

// 创建地图
function createMap() {
	// 影像数据源
	// const imgSource = [source.arcGisSource, source.testSource];
	const imgSource = [source.arcGisSource, source.arcGisCiaSource];
	// 地形数据源
	// const demSource = source.mapBoxDemSource;
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
	});

	// 地图旋转到xz平面
	map.rotateX(-Math.PI / 2);

	// 地图准备就绪
	map.addEventListener("ready", () => console.log("Map ready!!!!!!"));

	return map;
}

// 初始化三维场景
function initViewer(id: string, map: tt.TileMap) {
	// 地图中心坐标(经度，纬度，高度)
	const centerGeo = new Vector3(110, 30, 0);
	// 摄像坐标(经度，纬度，高度)
	const camersGeo = new Vector3(110, 0, 10000);
	// 地图中心经纬度高度转为世界坐标
	const centerPostion = map.geo2world(centerGeo);
	// 摄像机经纬度高度转为世界坐标
	const cameraPosition = map.geo2world(camersGeo);
	// 初始化场景
	const viewer = new tt.plugin.GLViewer(id, { centerPostion, cameraPosition });
	// 地图添加到场景
	viewer.scene.add(map);

	// const tileBounds = map.projection.getTileBounds(7, 2, 3);
	// const tileMesh = createBoundsMesh(tileBounds, 0xff0000);
	// map.add(tileMesh);

	// // const imageBounds = map.projection.getPorjBounds([200, 22, 250, 40]);
	// const imageBounds = map.imgSource[0]._projectionBounds;
	// const imageMesh = createBoundsMesh(imageBounds, 0x00ff00);
	// map.add(imageMesh);

	return viewer;
}

// function createBoundsMesh(bounds: [number, number, number, number], color: ColorRepresentation) {
// 	const points = [];
// 	const z = 8;
// 	points.push(new Vector3(bounds[0], bounds[1], z));
// 	points.push(new Vector3(bounds[2], bounds[1], z));
// 	points.push(new Vector3(bounds[2], bounds[3], z));
// 	points.push(new Vector3(bounds[0], bounds[3], z));
// 	points.push(new Vector3(bounds[0], bounds[1], z));
// 	const geometry = new BufferGeometry().setFromPoints(points);
// 	const line = new Line(geometry, new LineBasicMaterial({ color }));
// 	line.renderOrder = 100;
// 	return line;
// }

// 初始化GUI
function initGui(viewer: tt.plugin.GLViewer, map: tt.TileMap) {
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
	// 显示罗盘
	gui.showCompass(viewer);
	// 显示鼠标点击的瓦片信息-调试
	gui.showClickedTile(viewer, map);
}

// 动画漫游到h高度（修改摄像机坐标）
function flyTo(viewer: tt.plugin.GLViewer, h: number) {
	const tween = new Tween(viewer.camera.position);
	const to = viewer.camera.position.clone().setY(h);
	tween.to(to).start().onComplete(viewer.controls.saveState);
}

function main() {
	// 创建地图
	const map = createMap();
	// 开启阴影
	map.receiveShadow = true;
	// 创建视图
	const viewer = initViewer("#map", map);
	// 每帧更新TWEEN
	viewer.addEventListener("update", () => TWEEN.update());
	// 添加地图背景
	addMapBackground(map);
	// 添加伪地球遮罩
	addFakeEarth(viewer, map);
	// 防止摄像机进入地下
	limitCameraHeight(viewer, map);
	// 创建gui
	initGui(viewer, map);
	// 摄像机动画移动到3000km高空
	flyTo(viewer, 3000);
}

addEventListener("load", main);
