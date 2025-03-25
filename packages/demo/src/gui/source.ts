import { Vector3 } from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import * as tt from "three-tile";

import * as ms from "../mapSource";

import { GeoJSONLoader, GeoJSONSource, MVTLoader, MVTSource } from "../vectorTile/index";

// 注册GeoJSON加载器
tt.TileMap.registerImgLoader(new GeoJSONLoader());
// // 注册MVT加载器
tt.TileMap.registerImgLoader(new MVTLoader());

export const createSourceGui = (gui: GUI, viewer: tt.plugin.GLViewer, map: tt.TileMap) => {
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
			map.imgSource = [ms.arcGisSource, ms.tdtCiaSource_w];
			map.reload();
		},
		setArcGisHillShader: () => {
			map.imgSource = [
				new tt.plugin.ArcGisSource({
					style: "Elevation/World_HillShade_Dark",
				}),

				ms.tdtCiaSource_w,
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
			map.imgSource = [ms.stadiamaps];
			map.reload();
		},
		setTdt_w: () => {
			map.imgSource = [ms.tdtImgSource_w, ms.tdtCiaSource_w];
			map.reload();
		},
		setTdt_c: () => {
			map.imgSource = [ms.tdtImgSource_c, ms.testSource];
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
			map.imgSource = [ms.mapBoxDemTestSource, ms.testSource];
			map.reload();
		},
		setMapTilerDemTest: () => {
			map.imgSource = [ms.mapTilerDemTestSource, ms.testSource];
			map.reload();
		},
		setZkxtDemTest: () => {
			map.imgSource = [ms.xtDemTestSource, ms.testSource];
			map.reload();
		},
		setTileTest: () => {
			map.imgSource = [ms.mapBoxImgSource, ms.testSource];
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
			map.imgSource = [ms.arcGisSource, tt.TileSource.create({ dataType: "wireframe", opacity: 0.3 })];

			map.reload();
		},
		setTileNormal: () => {
			map.imgSource = [tt.TileSource.create({ dataType: "normal" }), ms.tdtCiaSource_w, ms.testSource];
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

			map.imgSource = [ms.arcGisSource, imgSource, ms.testSource];
			// map.imgSource = imgSource;
			map.demSource = demSource;

			// Move the camera to the bounds
			viewer.controls.target.copy(map.geo2world(new Vector3(108.627984, 30.66284, 0.0)));
			viewer.camera.position.copy(map.geo2world(new Vector3(108.627139, 30.64138, 3.309163)));
			map.reload();
		},
		setSingleImage() {
			map.imgSource = [ms.arcGisSource, ms.singleImage];
			map.demSource = ms.arcGisDemSource;
			map.reload();
		},

		setQm() {
			map.imgSource = [ms.arcGisSource, tt.TileSource.create({ dataType: "wireframe", opacity: 0.3 })];
			// map.imgSource = [ms.tdtImgSource_c, tt.TileSource.create({ dataType: "wireframe", opacity: 0.3 })];

			map.demSource = tt.TileSource.create({
				dataType: "quantized-mesh",
				// url: "./tiles/layer/{z}/{x}/{y}.terrain",
				url: "./tiles/layer/14/26302/11288.terrain",
				// url: "https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/{z}/{x}/{y}.terrain?key=FQHg9Gb5IgjIGLFg7tKz",
				// url: "https://assets.ion.cesium.com/ap-northeast-1/asset_depot/1/CesiumWorldTerrain/v1.2/{z}/{x}/{y}.terrain?extensions=octvertexnormals-watermask-metadata&v=1.2.0",
				// url: "/qm/terrain/{z}/{x}/{y}.terrain",
				// bounds: [-124.7333, 24.5333, -67.95, 49.3833],
				// bounds: [70, 10, 150, 60],
				maxLevel: 15,
			});
			map.reload();
		},

		setGeoJSON() {
			// https://geo.datav.aliyun.com/areas_v3/bound/100000.json
			// https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
			// https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json

			// const world = new GeoJSONSource({
			//     url: "world.json",
			//     style: {
			//         stroke: true,
			//         color: "white",
			//         fill: false,
			//         weight: 1,
			//         shadowColor: "black",
			//         shadowBlur: 1,
			//         shadowOffset: [1, 1],
			//     },
			// });

			const country = new GeoJSONSource({
				url: "https://geo.datav.aliyun.com/areas_v3/bound/100000.json",
				// url: "./省道_线.json",
				style: {
					stroke: true,
					color: "red",
					weight: 2,
					shadowColor: "black",
					shadowBlur: 3,
					shadowOffset: [2, 2],
				},
			});

			const province = new GeoJSONSource({
				url: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
				style: {
					stroke: true,
					fill: false,
					color: "Aqua",
					weight: 1,
				},
			});

			const city = new GeoJSONSource({
				url: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json",
				style: {
					stroke: true,
					color: "yellow",
					weight: 0.6,
				},
			});

			const cityPoint = new GeoJSONSource({
				url: "city.geojson",
				style: {
					minLevel: 4,
					fill: true,
					fillColor: "white",
					fillOpacity: 1,
					color: "black",
					weight: 1,
					shadowBlur: 3,
					shadowColor: "black",
				},
			});

			map.imgSource = [ms.arcGisSource, province, country, city, cityPoint];
			map.reload();
		},

		setMVT() {
			const mvtTest = new MVTSource({
				// maxLevel: 14,
				url: "https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=4SbPVVkPORGgXetw2vsf",
				style: {
					layer: {
						boundary: {
							color: "blue",
							weight: 1,
							shadowBlur: 3,
							shadowColor: "black",
							// fill: true,
							// dashArray: [3, 3],
						},
						transportation: {
							// visible: false,
							color: "yellow",
							weight: 1,
							shadowBlur: 2,
							shadowColor: "black",
						},
						water: {
							fill: true,
							color: "red",
							weight: 0,
							fillColor: "skyblue",
							fillOpacity: 0.3,
						},
						// place: {
						//     minLevel: 6,
						//     fill: true,
						//     fillColor: "white",
						//     fillOpacity: 1,
						//     shadowBlur: 2,
						//     shadowColor: "black",
						// },
					},
				},
			});
			map.imgSource = [ms.arcGisSource, mvtTest];
			map.reload();
		},

		setTif: () => {
			map.imgSource = [ms.arcGisSource];
			map.demSource = ms.tiffDEM;
			map.reload();
		},
	};

	// 数据源
	const folder = gui.addFolder("Map Data Source").close();
	// 影像数据源
	const imgFolder = folder.addFolder("Image data");
	imgFolder.add(vm, "setMapBox").name("MapBox+TDT");
	imgFolder.add(vm, "setZkxt").name("ZKXT");
	imgFolder.add(vm, "setBing").name("Bing+TDT");
	imgFolder.add(vm, "setGoogle").name("Google image");
	imgFolder.add(vm, "setGoogleP").name("Google terrain image");
	imgFolder.add(vm, "setArcGis").name("ArcGis+TDT");
	imgFolder.add(vm, "setArcGisHillShader").name("ArcGisHillShader+TDT");
	imgFolder.add(vm, "setMapTiler").name("MapTiler+TDT");
	imgFolder.add(vm, "setStadia").name("Stadis");
	imgFolder.add(vm, "setGD").name("GadoDe");
	imgFolder.add(vm, "setTencent").name("Tencent");
	imgFolder.add(vm, "setTdt_w").name("TDT");
	imgFolder.add(vm, "setOpentopomap").name("OpenTopoMap");

	imgFolder.add(vm, "setTdt_c").name("TDT(4326 projection)");

	imgFolder.add(vm, "setGeoJSON").name("GeoJSON-test");
	imgFolder.add(vm, "setMVT").name("MVT-test");

	// 地形数据源
	const demFolder = folder.addFolder("Terrain data");
	demFolder.add(vm, "setDemNull").name("None(plane)");
	demFolder.add(vm, "setMapBoxDem").name("Mapbox terrain(maxLevel=15)");
	demFolder.add(vm, "setMapTilerDem").name("MapTiler terrain(maxLevel=12)");
	// demFolder.add(vm, "setZkXtDem").name("ZKXT(maxLevel=10)");
	demFolder.add(vm, "setArcgisLerc").name("ArcGis terrain LERC(maxLevel=13)");
	demFolder.add(vm, "setTif").name("TIF DEM");

	// 测试数据
	const testFolder = folder.addFolder("Test data");
	testFolder.add(vm, "setTileTest").name("MapBoxImage+debug");
	testFolder.add(vm, "setMapBoxDemTest").name("MapBoxTerrain+debug");
	testFolder.add(vm, "setMapTilerDemTest").name("MapTilerTerrain+debug");
	// testFolder.add(vm, "setZkxtDemTest").name("中科星图Terrain+debug");
	testFolder.add(vm, "setLogoTest").name("Logo test");
	testFolder.add(vm, "setTileWire").name("Wireframe terrain");
	testFolder.add(vm, "setTileNormal").name("Normal terrain");
	testFolder.add(vm, "setBoundsTile").name("Bounds limit test");
	testFolder.add(vm, "setSingleImage").name("SingleImage");
	// testFolder.add(vm, "setQm").name("quantized-mesh test");

	return gui;
};
