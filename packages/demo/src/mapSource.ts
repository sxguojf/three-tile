import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

const {
	ArcGisDemSource,
	ArcGisSource,
	BingSource,
	GDSource,
	GoogleSource,
	MapBoxSource,
	MapTilerSource,
	StadiaSource,
	TDTQMSource,
	TDTSource,
	TXSource,
	ZKXTQMSource,
	ZKXTSource,
} = plugin;

// MapBox
const MAPBOXKEY = //"pk.eyJ1IjoidG9tYWNoIiwiYSI6ImNrbnR6d3psMzA4YWgydnBzeGhrNW1mdDgifQ.zq6mWEop1OTBrQ24R0SdlA";
	// "pk.eyJ1IjoiY2FvcnVpYmluIiwiYSI6ImNsYWR3MjEwMjA5b2UzcW85dmZlbTVtMTAifQ.4v81PyG-oZ6TVL7IuyCbrg";
	// "pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ";
	// "pk.eyJ1Ijoia29yeXdrYSIsImEiOiJja2p1ajdlOWozMnF2MzBtajRvOTVzZDRpIn0.nnlX7TDuZ3zuGkZGr_oA3A";
	// "pk.eyJ1IjoiaGF3azg2MTA0IiwiYSI6ImNrbTQ3cWtyeTAxejEzMHBtcW42bmc0N28ifQ.bvS9U_yWdHDh41jzaDS1dw";
	// "pk.eyJ1IjoiMTgzODI0ZHl0IiwiYSI6ImNqbHExNDVjZzI0ZmUza2wxMDhocnlyem4ifQ.FZoJzmqTtli8hAvvAc1OPA";
	// "pk.eyJ1Ijoibmlld3poIiwiYSI6ImNqbjRvM2F4ODA5ZDEzd2xkd2oxZnB4Y2UifQ.phMvmLw9t9lDxobKyYVbPw";
	// "pk.eyJ1IjoiYnJhbnpoYW5nIiwiYSI6ImNqM3FycmVldjAxZTUzM2xqMmllNnBjMHkifQ.Wv3ekbtia0BuUHGWVUGoFg"
	"pk.eyJ1Ijoiemhhbmdjb29raWUiLCJhIjoiY2tyMngybmVvMGl3cTJvcGRrNzNna2FxcyJ9.Abt7my-eFxMOmgxGXwVknA";
export const mapBoxImgSource = new MapBoxSource({
	token: MAPBOXKEY,
	dataType: "image",
	style: "mapbox.satellite",
});
export const mapBoxDemSource = new MapBoxSource({
	token: MAPBOXKEY,
	dataType: "terrain-rgb",
	style: "mapbox.terrain-rgb",
	minLevel: 5,
	maxLevel: 15,
});
export const mapBoxDemTestSource = new MapBoxSource({
	token: MAPBOXKEY,
	dataType: "image",
	style: "mapbox.terrain-rgb",
	minLevel: 5,
	maxLevel: 15,
});

export const mapBoxMartiniSource = new MapBoxSource({
	token: MAPBOXKEY,
	dataType: "terrain-rgb-martini",
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
	minLevel: 5,
	maxLevel: 10,
});
export const xtDemTestSource = new ZKXTSource({
	token: ZKXTKEY,
	dataType: "image",
	style: "terrain_rgb",
	format: "png",
	minLevel: 5,
	maxLevel: 10,
});

export const xtQmSource = new ZKXTQMSource({
	token: ZKXTKEY,
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

export const tdtQMSource = new TDTQMSource({
	token: TDTKEY,
});

// Bing
export const bingSource = new BingSource({ style: "A" });

// 高德
export const gdImgSource = new GDSource({ style: "6" });
export const gdImgLabelSource = new GDSource({ style: "8" });

// arcgis
export const arcGisImgSource = new ArcGisSource();
export const arcGisDemSource = new ArcGisDemSource();
export const arcGisCiaSource = new ArcGisSource({
	style: "Reference/World_Boundaries_and_Places",
});

// 腾讯
export const tencentSource = new TXSource();

// google
export const googleSource = new GoogleSource();

// 测试瓦片
export const debugSource = new tt.TileSource({
	dataType: "debug",
	// bounds: [108.68808746337891, 33.92199531197548, 108.88240814208984, 34.05727051198483],
});

export const wrieframe = tt.TileSource.create({ dataType: "wireframe", opacity: 0.3 });

// 单张图片测试瓦片源
export const singleImage = new tt.TileSource({
	dataType: "single-image",
	url: "./image/qinling.png",
	maxLevel: 20,
	bounds: [108.68808746337891, 33.92199531197548, 108.88240814208984, 34.05727051198483],
});

export const singleTif = new tt.TileSource({
	dataType: "single-tif",
	url: "./image/qinling.tif",
	// maxLevel: 20,
	// skirtHeight: 1000,
	bounds: singleImage.bounds, //[108.68808746337891, 33.92199531197548, 108.88240814208984, 34.05727051198483],
});

export const tiffDEM = new tt.TileSource({
	dataType: "single-tif",
	url: "./image/dem.tif",
	// maxLevel: 20,
	// skirtHeight: 1000,
	bounds: [111.16267204284668, 21.59287851485902, 111.23897552490234, 21.64825416643841],
});

export const mvtTest = new plugin.MVTSource({
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

export const geojsonCountry = new plugin.GeoJSONSource({
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

export const geojsonProvince = new plugin.GeoJSONSource({
	url: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
	style: {
		stroke: true,
		fill: false,
		color: "Aqua",
		weight: 1,
	},
});

export const geojsonCity = new plugin.GeoJSONSource({
	url: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json",
	style: {
		stroke: true,
		color: "yellow",
		weight: 0.6,
	},
});

export const geojsonCityPoint = new plugin.GeoJSONSource({
	url: "city.geojson",
	minLevel: 4,
	style: {
		fill: true,
		fillColor: "white",
		fillOpacity: 1,
		color: "black",
		weight: 1,
		shadowBlur: 3,
		shadowColor: "black",
	},
});

export const filterImgSource = new tt.TileSource({
	dataType: "image-filter",
	url: "https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
});

export const citySource = new plugin.GeoJSONSource({
	url: "./cityBounds.geojson",
	dataType: "geojson",
	style: {
		stroke: true,
		color: "red",
		weight: 2,
	},
	// bounds: [107, 35, 111, 38],
});

export const cityMaskSource = new plugin.GeoJSONSource({
	url: "./cityBoundsMask.geojson",
	dataType: "geojson",
	style: {
		stroke: false,
		fill: true,
		fillColor: "black",
		fillOpacity: 0.8,
	},
	// bounds: [106.875, 34.886, 110.391, 36.598],
});

export const wmsTest1 = tt.TileSource.create({
	bounds: [116.6, 30.9, 118, 32.6],
	url: "https://server.mars3d.cn/geoserver/mars/wms?transparent=true&format=image/png&service=WMS&version=1.1.1&request=GetMap&styles=&layers=hfdl,hfbj&bbox={bbox}&width=256&height=256&srs=EPSG:3857",
});

export const wmsTest2 = tt.TileSource.create({
	url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi?&service=WMS&request=GetMap&layers=nexrad-n0r-wmst&styles=&format=image/png&transparent=true&version=1.1.1&time=2005-08-29T14:00&width=256&height=256&srs=EPSG:3857&bbox={bbox}",
});
