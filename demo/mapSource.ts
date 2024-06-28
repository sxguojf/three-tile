import * as tt from "../src";
import {
	MapBoxSource,
	ArcGisDemSource,
	ArcGisSource,
	BingSource,
	GDSource,
	GoogleSource,
	MapTilerSource,
	TDTSource,
	TXSource,
	ZKXTSource,
	StadiaSource,
} from "../src/plugin";

// import * as tt from "../dist/three-tile";
// await lercInit();

// MapBox
const MAPBOXKEY =
	// "pk.eyJ1IjoiY2FvcnVpYmluIiwiYSI6ImNsYWR3MjEwMjA5b2UzcW85dmZlbTVtMTAifQ.4v81PyG-oZ6TVL7IuyCbrg";
	// "pk.eyJ1IjoidG9tYWNoIiwiYSI6ImNrbnR6d3psMzA4YWgydnBzeGhrNW1mdDgifQ.zq6mWEop1OTBrQ24R0SdlA";
	"pk.eyJ1Ijoic2hhbmUwMjIwNzIiLCJhIjoiY2p5amF6YnFiMDB0YjNkcGU1ZWxoMWl0NiJ9.TsmgK5-HJKWOE-DscbNbTA";
export const mapBoxImgSource = new MapBoxSource({
	token: MAPBOXKEY,
	dataType: "image",
	style: "mapbox.satellite",
});
export const mapBoxDemSource = new MapBoxSource({
	token: MAPBOXKEY,
	dataType: "terrain-rgb",
	style: "mapbox.terrain-rgb",
	maxLevel: 15,
});
export const mapBoxDemTestSource = new MapBoxSource({
	token: MAPBOXKEY,
	dataType: "image",
	style: "mapbox.terrain-rgb",
	maxLevel: 15,
});

// 中科星图
const ZKXTKEY = "4ea7bc4e9a2efc4e76be33d9511600dfa3b4f24bb81cb69561ab0b833d9b482c";
export const xtImgSource = new ZKXTSource({
	token: ZKXTKEY,
	dataType: "image",
	style: "img",
	format: "webp",
});
export const xtCiaSource = new ZKXTSource({
	token: ZKXTKEY,
	dataType: "image",
	style: "cia",
	format: "webp",
});
export const xtDemSource = new ZKXTSource({
	token: ZKXTKEY,
	dataType: "terrain-rgb",
	style: "terrain_rgb",
	format: "png",
	maxLevel: 10,
});
export const xtDemTestSource = new ZKXTSource({
	token: ZKXTKEY,
	dataType: "image",
	style: "terrain_rgb",
	format: "png",
	maxLevel: 10,
});

// MapTiler
const MAPTILERKEY = "get_your_own_key_QmavnBrQwNGsQ8YvPzZg";
export const mapTilerImgSource = new MapTilerSource({
	token: MAPTILERKEY,
	dataType: "image",
	style: "satellite",
	format: "jpg",
});
export const mapTilerDemSource = new MapTilerSource({
	token: MAPTILERKEY,
	dataType: "terrain-rgb",
	style: "terrain-rgb",
	format: "png",
	maxLevel: 12,
});
export const mapTilerDemTestSource = new MapTilerSource({
	token: MAPTILERKEY,
	dataType: "image",
	style: "terrain-rgb",
	format: "png",
	maxLevel: 12,
});

// Stadia
export const stadiamaps = new StadiaSource();

// 天地图
const TDTKEY =
	//"8e1ef0f654f67d2252b2fbe39517665c";
	// "4fa16fcfc196d1a6c435753b0850a336";
	// "56b81006f361f6406d0e940d2f89a39c";
	// "eba82bdad37844f02de970c9cefed234";
	"85c9d12d5d691d168ba5cb6ecaa749eb";

export const tdtImgSource_w = new TDTSource({
	token: TDTKEY,
	style: "img_w",
});

export const tdtCiaSource_w = new TDTSource({
	token: TDTKEY,
	style: "cia_w",
});

export const tdtIboSource_w = new TDTSource({
	token: TDTKEY,
	style: "cta_w",
});

export const tdtImgSource_c = new TDTSource({
	token: TDTKEY,
	style: "img_c",
	projectionID: "4326",
});

// Bing
export const bingSource = new BingSource({ style: "A,L" });

// 高德
export const gdImgSource = new GDSource({ style: "6" });
export const gdImgLabelSource = new GDSource({ style: "8" });

// arcgis
export const arcGisSource = new ArcGisSource();
// export const arcGisDemSource = new ArcGisDemSource();
export const arcGisCiaSource = new ArcGisSource({
	style: "Reference/World_Boundaries_and_Places",
});

// 腾讯
export const tencentSource = new TXSource();

// google
export const googleSource = new GoogleSource();

// 测试瓦片
export const testSource = new tt.TileSource({ dataType: "debug" });
