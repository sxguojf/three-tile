import { AxesHelper, BoxGeometry, Mesh, MeshStandardMaterial, TextureLoader, Vector3 } from "three";
import TWEEN, { Tween } from "three/examples/jsm/libs/tween.module.js";
import * as tt from "../src";
import * as gui from "./gui";
import * as source from "./mapSource";
import { addFakeEarth, addMapBackground, limitCameraHeight } from "./utils";

console.log(`three-tile V${tt.version}, ${tt.author.name}`);

// 创建地图
function createMap() {
	// 影像数据源
	const imgSource = [source.arcGisSource, source.arcGisCiaSource];
	// 地形数据源
	const demSource = source.mapBoxDemSource;

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
	return map;
}

// 初始化三维场景
function initViewer(id: string, map: tt.TileMap) {
	// 地图中心坐标(经度，纬度，高度)
	const centerGeo = new Vector3(110, 30, 0);
	// 摄像坐标(经度，纬度，高度)
	const camersGeo = new Vector3(110, 0, 10000);
	// 地图中心转为世界坐标
	const centerPostion = map.localToWorld(map.geo2pos(centerGeo));
	// 摄像机转为世界坐标
	const cameraPosition = map.localToWorld(map.geo2pos(camersGeo));
	// 初始化场景
	const viewer = new tt.plugin.GLViewer(id, { centerPostion, cameraPosition });
	// 地图添加到场景
	viewer.scene.add(map);

	// map.castShadow = true;
	// map.receiveShadow = true;
	// viewer.renderer.shadowMap.enabled = true;
	// viewer.renderer.shadowMap.type = PCFSoftShadowMap;
	// viewer.dirLight.shadow.camera.position.set(0, 10000000, 0);
	// viewer.dirLight.shadow.camera.far = 100000;
	// viewer.dirLight.shadow.camera.left = -1000;
	// viewer.dirLight.shadow.camera.right = 1000;
	// viewer.dirLight.shadow.camera.top = 1000;
	// viewer.dirLight.shadow.camera.bottom = -1000;
	// viewer.scene.add(new DirectionalLightHelper(viewer.dirLight));
	// viewer.scene.add(new CameraHelper(viewer.dirLight.shadow.camera));

	// 坐标轴
	const helper = new AxesHelper(6e4);
	helper.position.copy(centerPostion);
	viewer.scene.add(helper);

	addTestModel(viewer, centerPostion);

	return viewer;
}

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

function addTestModel(viewer: tt.plugin.GLViewer, position: Vector3) {
	const mat = new MeshStandardMaterial({
		map: new TextureLoader().load("./image/test.jpg"),
	});

	const geo = new BoxGeometry(100, 100, 100);
	geo.translate(0, 50, 0);
	const mesh = new Mesh(geo, mat);
	mesh.position.copy(position);
	mesh.castShadow = true;
	viewer.scene.add(mesh);
}

function main() {
	// 创建地图
	const map = createMap();
	map.receiveShadow = true;

	// 创建视图
	const viewer = initViewer("#map", map);

	// 每帧更新TWEEN
	viewer.addEventListener("update", () => TWEEN.update());

	// 添加地图背景图
	addMapBackground(viewer, map);

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
