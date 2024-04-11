import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as tt from "../../src";
import * as MapSource from "../mapSource";
import { BaseSource } from "../../src";

export const createSourceGui = (gui: GUI, map: tt.TileMap) => {
	const vm = {
		setMapBox: () => {
			map.imgSource = [MapSource.mapBoxImgSource, MapSource.tdtCiaSource_w];
			map.reload();
		},
		setZkxt: () => {
			map.imgSource = [MapSource.xtImgSource, MapSource.xtCiaSource];
			map.reload();
		},
		setBing: () => {
			map.imgSource = [MapSource.bingSource];
			map.reload();
		},
		setArcGis: () => {
			map.imgSource = [MapSource.arcGisSource];
			map.reload();
		},
		setArcGisHillShader: () => {
			map.imgSource = [
				new tt.plugin.ArcGisSource({
					style: "Elevation/World_HillShade_Dark",
				}),
				MapSource.xtCiaSource,
			];
			map.reload();
		},
		setGoogle: () => {
			// map.imgSource = [new GoogleSource({ style: "y" })];
			map.imgSource = [new tt.plugin.GoogleSource()];
			map.reload();
		},
		setGoogleP: () => {
			map.imgSource = [new tt.plugin.GoogleSource({ style: "p", maxLevel: 15 })];
			map.reload();
		},
		setStadia: () => {
			map.imgSource = [MapSource.stadiamaps];
			map.reload();
		},
		setGeoq: () => {
			map.imgSource = [new tt.plugin.GeoqSource()];
			map.reload();
		},
		setTdt_w: () => {
			map.imgSource = [MapSource.tdtImgSource_w, MapSource.tdtCiaSource_w];
			map.reload();
		},
		setTdt_c: () => {
			map.imgSource = [MapSource.tdtImgSource_c, MapSource.testSource];
			// map.demSource = undefined;
			map.reload();
		},
		setTdt_qm: () => {
			const dem = tt.BaseSource.create({
				dataType: "quantized-mesh",
				// url: "https://t0.tianditu.gov.cn/mapservice/swdx?T=elv_c&x={x}&y={y}&l={z}&tk=eba82bdad37844f02de970c9cefed234",
				// url: "https://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=tk=eba82bdad37844f02de970c9cefed234",
				// url: "https://t0.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=eba82bdad37844f02de970c9cefed234",
				// url: "https://api.maptiler.com/tiles/terrain-quantized-mesh/{z}/{x}/{y}.terrain?key=get_your_own_key_QmavnBrQwNGsQ8YvPzZg",
				// url: "http://tianditu.gov.cn/mapservice/GetTiles?&x={x}&y={y}&l={z}&tk=eba82bdad37844f02de970c9cefed234",
				// url: "https://tiles1.geovisearth.com/base/v1/terrain/{z}/{x}/{y}.terrain?v=1.1.0&token=4ea7bc4e9a2efc4e76be33d9511600dfa3b4f24bb81cb69561ab0b833d9b482c",
				url: "https://t1.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk=eba82bdad37844f02de970c9cefed234&x={x}&y={y}&l={z}",
			});
			map.demSource = dem;
			map.reload();
		},
		setGD: () => {
			map.imgSource = [MapSource.gdImgSource, MapSource.gdImgLabelSource];
			map.reload();
		},

		setTencent: () => {
			// map.imgSource = [source.tencentSource, source.gdImgLabelSource];
			map.imgSource = [MapSource.tencentSource];
			map.reload();
		},
		setMapTiler: () => {
			map.imgSource = [MapSource.mapTilerImgSource, MapSource.xtCiaSource];
			map.reload();
		},

		setOpentopomap: () => {
			map.imgSource = BaseSource.create({
				subdomains: "abc",
				url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
			});
			map.reload();
		},

		// 地形
		setMapBoxDem: () => {
			map.demSource = MapSource.mapBoxDemSource;
			map.reload();
		},
		setMapTilerDem: () => {
			map.demSource = MapSource.mapTilerDemSource;
			map.reload();
		},
		setZkXtDem: () => {
			map.demSource = MapSource.xtDemSource;
			map.reload();
		},
		setDemNull: () => {
			map.demSource = undefined;
			map.reload();
		},

		setArcgisLerc() {
			map.demSource = MapSource.arcGisDemSource;
			map.reload();
		},

		// 测试
		setMapBoxDemTest: () => {
			map.imgSource = [MapSource.mapBoxDemTestSource, MapSource.testSource];
			map.reload();
		},
		setMapTilerDemTest: () => {
			map.imgSource = [MapSource.mapTilerDemTestSource, MapSource.testSource];
			map.reload();
		},
		setZkxtDemTest: () => {
			map.imgSource = [MapSource.xtDemTestSource, MapSource.testSource];
			map.reload();
		},
		setTileTest: () => {
			map.imgSource = [MapSource.mapBoxImgSource, MapSource.testSource];
			map.reload();
		},
		setLogoTest: () => {
			map.imgSource = [
				MapSource.mapBoxImgSource,
				tt.BaseSource.create({
					dataType: "logo",
					attribution: "This is a logo",
					opacity: 0.8,
				}),
			];
			map.reload();
		},
		setTileWire: () => {
			map.imgSource = [tt.BaseSource.create({ dataType: "wireframe", opacity: 0.3 })];

			map.reload();
		},
		setTileNormal: () => {
			map.imgSource = [
				tt.BaseSource.create({ dataType: "normal" }),
				MapSource.tdtCiaSource_w,
				MapSource.testSource,
			];
			map.reload();
		},
	};

	// 数据源
	const folder = gui.addFolder("地图数据源").close();
	// 影像数据源
	const imgFolder = folder.addFolder("影像数据");
	imgFolder.add(vm, "setMapBox").name("MapBox影像+天地图标注");
	imgFolder.add(vm, "setZkxt").name("中科星图");
	imgFolder.add(vm, "setBing").name("微软影像(有偏移)");
	imgFolder.add(vm, "setGoogle").name("Google影像");
	imgFolder.add(vm, "setGoogleP").name("Google地形");
	imgFolder.add(vm, "setArcGis").name("ArcGis影像");
	imgFolder.add(vm, "setArcGisHillShader").name("ArcGis山影+中科星图标注");
	imgFolder.add(vm, "setMapTiler").name("MapTiler影像+中科星图标注");
	imgFolder.add(vm, "setStadia").name("Stadis影像");
	imgFolder.add(vm, "setGeoq").name("GeoQ地图");
	imgFolder.add(vm, "setGD").name("高德(大偏移)");
	imgFolder.add(vm, "setTencent").name("腾讯(大偏移)");
	imgFolder.add(vm, "setTdt_w").name("天地图");
	imgFolder.add(vm, "setTdt_c").name("天地图(经纬度投影)");
	imgFolder.add(vm, "setOpentopomap").name("OpenTopoMap");

	// 地形数据源
	const demFolder = folder.addFolder("地形数据");
	demFolder.add(vm, "setDemNull").name("无地形");
	demFolder.add(vm, "setMapBoxDem").name("Mapbox地形(maxLevel=15)");
	demFolder.add(vm, "setMapTilerDem").name("MapTiler地形(maxLevel=12)");
	demFolder.add(vm, "setZkXtDem").name("中科星图(maxLevel=10)");
	// demFolder.add(vm, "setTdt_qm").name("天地图QuantizedMesh");
	demFolder.add(vm, "setArcgisLerc").name("ArcGis地形LERC(maxLevel=13)");

	// 测试数据
	const testFolder = folder.addFolder("测试数据");
	testFolder.add(vm, "setTileTest").name("MapBox影像+测试瓦片");
	testFolder.add(vm, "setMapBoxDemTest").name("MapBox地形+测试瓦片");
	testFolder.add(vm, "setMapTilerDemTest").name("MapTiler地形+测试瓦片");
	testFolder.add(vm, "setZkxtDemTest").name("中科星图地形+测试瓦片");
	testFolder.add(vm, "setLogoTest").name("Logo水印测试");
	testFolder.add(vm, "setTileWire").name("Wireframe地形网格测试");
	testFolder.add(vm, "setTileNormal").name("法向量测试");

	return gui;
};
