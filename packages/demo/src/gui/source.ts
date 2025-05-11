import { Vector3 } from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

import * as ms from "../mapSource";

export const createSourceGui = (gui: GUI, viewer: plugin.GLViewer, map: tt.TileMap) => {
	const vm = {
		setMapBox: () => {
			map.imgSource = [ms.mapBoxImgSource, ms.tdtCiaSource_w];
			map.reload();
		},
		setZkxt: () => {
			map.imgSource = [ms.xtImgSource, ms.xtCiaSource];
			map.reload();
		},
		setBing: () => {
			map.imgSource = [ms.bingSource, ms.tdtCiaSource_w];
			map.reload();
		},
		setArcGis: () => {
			map.imgSource = [ms.arcGisImgSource, ms.tdtCiaSource_w];
			map.reload();
		},
		setArcGisHillShader: () => {
			map.imgSource = [
				new plugin.BingSource({ style: "G", maxLevel: 18 }),
				new plugin.ArcGisSource({
					style: "Elevation/World_HillShade_Dark",
					maxLevel: 13,
					opacity: 0.6,
				}),
			];
			map.reload();
		},
		setGoogle: () => {
			// map.imgSource = [new GoogleSource({ style: "y" })];
			map.imgSource = [new plugin.GoogleSource()];
			map.reload();
		},
		setGoogleP: () => {
			map.imgSource = [new plugin.GoogleSource({ style: "p", maxLevel: 15 })];
			map.reload();
		},

		setStadia: () => {
			map.imgSource = [ms.stadiamaps];
			map.reload();
		},
		setTdt_w: () => {
			map.imgSource = [ms.tdtImgSource_w, ms.tdtCiaSource_w];
			map.reload();
		},
		setTdt_c: () => {
			map.imgSource = [ms.tdtImgSource_c, ms.debugSource];
			// map.demSource = undefined;
			map.reload();
		},
		setGD: () => {
			map.imgSource = [ms.gdImgSource, ms.gdImgLabelSource];
			map.reload();
		},

		setTencent: () => {
			// map.imgSource = [source.tencentSource, source.gdImgLabelSource];
			map.imgSource = [ms.tencentSource];
			map.reload();
		},
		setMapTiler: () => {
			map.imgSource = [ms.mapTilerImgSource, ms.tdtCiaSource_w];
			map.reload();
		},

		setOpentopomap: () => {
			map.imgSource = tt.TileSource.create({
				subdomains: "abc",
				url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
			});
			map.reload();
		},

		// terrain
		setMapBoxDem: () => {
			map.demSource = ms.mapBoxDemSource;
			map.reload();
		},
		setMapTilerDem: () => {
			map.demSource = ms.mapTilerDemSource;
			map.reload();
		},
		setZkXtDem: () => {
			map.demSource = ms.xtDemSource;
			map.reload();
		},
		setDemNull: () => {
			map.demSource = undefined;
			map.reload();
		},

		setArcgisLerc() {
			map.demSource = ms.arcGisDemSource;
			map.reload();
		},

		// test
		setMapBoxDemTest: () => {
			map.imgSource = [ms.mapBoxDemTestSource, ms.debugSource];
			map.reload();
		},
		setMapTilerDemTest: () => {
			map.imgSource = [ms.mapTilerDemTestSource, ms.debugSource];
			map.reload();
		},
		setZkxtDemTest: () => {
			map.imgSource = [ms.xtDemTestSource, ms.debugSource];
			map.reload();
		},
		setTileTest: () => {
			map.imgSource = [ms.mapBoxImgSource, ms.debugSource];
			map.reload();
		},
		setLogoTest: () => {
			map.imgSource = [
				ms.mapBoxImgSource,
				tt.TileSource.create({
					dataType: "logo",
					attribution: "This is a logo",
					opacity: 0.8,
				}),
			];
			map.reload();
		},
		setTileWire: () => {
			map.imgSource = [ms.arcGisImgSource, tt.TileSource.create({ dataType: "wireframe", opacity: 0.3 })];

			map.reload();
		},
		setTileNormal: () => {
			map.imgSource = [tt.TileSource.create({ dataType: "normal" }), ms.tdtCiaSource_w, ms.debugSource];
			map.reload();
		},

		setBoundsTile: () => {
			const bounds: [number, number, number, number] = [
				108.60157012939453, 30.64670562744141, 108.65313291549683, 30.69008231163025,
			];
			const urlPrefix = "http://127.0.0.1:5500/testSource";
			const imgSource = tt.TileSource.create({
				url: urlPrefix + "/img/{z}/{x}/{y}.png",
				bounds,
				minLevel: 0,
				maxLevel: 15,
			});

			const demSource = tt.TileSource.create({
				dataType: "terrain-rgb",
				url: urlPrefix + "/dem/{z}/{x}/{y}.png",
				bounds,
				minLevel: 5,
				maxLevel: 15,
			});

			map.imgSource = [ms.arcGisImgSource, imgSource, ms.debugSource];
			// map.imgSource = imgSource;
			map.demSource = demSource;

			// Move the camera to the bounds
			viewer.controls.target.copy(map.geo2world(new Vector3(108.627984, 30.66284, 0.0)));
			viewer.camera.position.copy(map.geo2world(new Vector3(108.627139, 30.64138, 3.309163)));
			map.reload();
		},
		setSingleImage() {
			map.imgSource = [ms.arcGisImgSource, ms.singleImage];
			map.demSource = ms.arcGisDemSource;
			map.reload();
		},

		setQm() {
			map.imgSource = [ms.arcGisImgSource, tt.TileSource.create({ dataType: "wireframe", opacity: 0.3 })];
			// map.imgSource = [ms.tdtImgSource_c, tt.TileSource.create({ dataType: "wireframe", opacity: 0.3 })];

			map.demSource = tt.TileSource.create({
				dataType: "quantized-mesh",
				// url: "./tiles/layer/{z}/{x}/{y}.terrain",
				url: "./tiles/layer/14/26302/11288.terrain",
				// url: "https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/" +
				// 	"{z}/{x}/{y}.terrain?key=FQHg9Gb5IgjIGLFg7tKz",
				// url: "https://assets.ion.cesium.com/ap-northeast-1/asset_depot/1/" +
				// 	"CesiumWorldTerrain/v1.2/{z}/{x}/{y}.terrain?" +
				// 	"extensions=octvertexnormals-watermask-metadata&v=1.2.0",
				// url: "/qm/terrain/{z}/{x}/{y}.terrain",
				// bounds: [-124.7333, 24.5333, -67.95, 49.3833],
				maxLevel: 15,
			});
			map.reload();
		},

		setGeoJSON() {
			map.imgSource = [ms.arcGisImgSource, ms.geojsonProvince, ms.geojsonCountry, ms.geojsonCity, ms.geojsonCityPoint];
			map.reload();
		},

		setMVT() {
			map.imgSource = [ms.arcGisImgSource, ms.mvtTest];
			// map.imgSource = [ms.mvtTest];
			map.reload();
		},

		setTif: () => {
			map.imgSource = [ms.arcGisImgSource];
			map.demSource = ms.tiffDEM;
			map.reload();
		},
	};

	// 数据源
	const folder = gui.addFolder("地图数据源").close();
	// 影像数据源
	const imgFolder = folder.addFolder("影像数据");
	imgFolder.add(vm, "setMapBox").name("MapBox+天地图");
	imgFolder.add(vm, "setZkxt").name("中科星图");
	imgFolder.add(vm, "setBing").name("Bing+天地图");
	imgFolder.add(vm, "setGoogle").name("google影像");
	imgFolder.add(vm, "setGoogleP").name("google地形渲染");
	imgFolder.add(vm, "setArcGis").name("ArcGis+天地图");
	imgFolder.add(vm, "setArcGisHillShader").name("ArcGis山影+bing交通");
	imgFolder.add(vm, "setMapTiler").name("MapTiler+天地图");
	imgFolder.add(vm, "setStadia").name("Stadis");
	imgFolder.add(vm, "setGD").name("高德");
	imgFolder.add(vm, "setTencent").name("腾讯");
	imgFolder.add(vm, "setTdt_w").name("天地图");
	imgFolder.add(vm, "setOpentopomap").name("OpenTopoMap");

	imgFolder.add(vm, "setTdt_c").name("天地图(EPSG:4326)");

	imgFolder.add(vm, "setGeoJSON").name("GeoJSON测试");
	imgFolder.add(vm, "setMVT").name("矢量瓦片MVT测试");

	// 地形数据源
	const demFolder = folder.addFolder("地形数据");
	demFolder.add(vm, "setDemNull").name("无地形");
	demFolder.add(vm, "setMapBoxDem").name("Mapbox(maxLevel=15)");
	demFolder.add(vm, "setMapTilerDem").name("MapTiler(maxLevel=12)");
	// demFolder.add(vm, "setZkXtDem").name("ZKXT(maxLevel=10)");
	demFolder.add(vm, "setArcgisLerc").name("ArcGis-LERC(maxLevel=13)");
	demFolder.add(vm, "setTif").name("TIFF地形");

	// 测试数据
	const testFolder = folder.addFolder("测试数据");
	testFolder.add(vm, "setTileTest").name("MapBox影像调试");
	testFolder.add(vm, "setMapBoxDemTest").name("MapBox地形调试");
	testFolder.add(vm, "setMapTilerDemTest").name("MapTiler地形调试");
	// testFolder.add(vm, "setZkxtDemTest").name("中科星图Terrain+debug");
	testFolder.add(vm, "setLogoTest").name("Logo测试");
	testFolder.add(vm, "setTileWire").name("地形模型网格测试");
	testFolder.add(vm, "setTileNormal").name("地形法向量调试");
	testFolder.add(vm, "setBoundsTile").name("地图范围控制");
	testFolder.add(vm, "setSingleImage").name("单图片测试");
	// testFolder.add(vm, "setQm").name("quantized-mesh test");

	return gui;
};
