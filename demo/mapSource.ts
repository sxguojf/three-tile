import * as tt from "../src";
import {
	ArcGisDemSource,
	ArcGisSource,
	BingSource,
	GDSource,
	GoogleSource,
	MapBoxSource,
	MapTilerSource,
	StadiaSource,
	TDTSource,
	TXSource,
	ZKXTSource,
} from "../src/plugin";

// import * as tt from "../dist/three-tile";
// await lercInit();

// MapBox
const MAPBOXKEY = //"pk.eyJ1IjoidG9tYWNoIiwiYSI6ImNrbnR6d3psMzA4YWgydnBzeGhrNW1mdDgifQ.zq6mWEop1OTBrQ24R0SdlA";
	//"pk.eyJ1IjoiY2FvcnVpYmluIiwiYSI6ImNsYWR3MjEwMjA5b2UzcW85dmZlbTVtMTAifQ.4v81PyG-oZ6TVL7IuyCbrg";
	// "pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ";
	// "pk.eyJ1Ijoia29yeXdrYSIsImEiOiJja2p1ajdlOWozMnF2MzBtajRvOTVzZDRpIn0.nnlX7TDuZ3zuGkZGr_oA3A";
	// "pk.eyJ1IjoiaGF3azg2MTA0IiwiYSI6ImNrbTQ3cWtyeTAxejEzMHBtcW42bmc0N28ifQ.bvS9U_yWdHDh41jzaDS1dw";
	//"pk.eyJ1IjoiMTgzODI0ZHl0IiwiYSI6ImNqbHExNDVjZzI0ZmUza2wxMDhocnlyem4ifQ.FZoJzmqTtli8hAvvAc1OPA";
	"pk.eyJ1Ijoibmlld3poIiwiYSI6ImNqbjRvM2F4ODA5ZDEzd2xkd2oxZnB4Y2UifQ.phMvmLw9t9lDxobKyYVbPw";
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
	bounds: [-180, -60, 180, 85],
});
export const mapBoxDemTestSource = new MapBoxSource({
	token: MAPBOXKEY,
	dataType: "image",
	style: "mapbox.terrain-rgb",
	maxLevel: 15,
});

// 中科星图
const ZKXTKEY = "fa74f216c7265ac713a224dcd0a4d0f20e27b61051ed729b587111b4c410528b";
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
	// "85c9d12d5d691d168ba5cb6ecaa749eb";
	"d083e4cf30bfc438ef93436c10c2c20a";

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
export const bingSource = new BingSource({ style: "A" });

// 高德
export const gdImgSource = new GDSource({ style: "6" });
export const gdImgLabelSource = new GDSource({ style: "8" });

// arcgis
export const arcGisSource = new ArcGisSource();
export const arcGisDemSource = new ArcGisDemSource();
export const arcGisCiaSource = new ArcGisSource({
	style: "Reference/World_Boundaries_and_Places",
});

// 腾讯
export const tencentSource = new TXSource();

// google
export const googleSource = new GoogleSource();

// 测试瓦片
export const testSource = new tt.TileSource({ dataType: "debug" });

// 单张图片测试瓦片源
export const singleImage = new tt.TileSource({
	dataType: "single-image",
	url: "./image/test.jpg",
	bounds: [90, 40, 130, 10],
});
