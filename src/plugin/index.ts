/**
 *@description: three-tile plugin
 *@author: Guojf
 *@date: 2023-04-05
 */

// tile raster image loader. 影像瓦片加载器
import "./tileImageLoader";
// Mapbox terrain-rgb loader. terrain-rgb格式地形瓦片加载器
import "./terrainRGBLoader";
// debug material loader. 调试瓦片加载器
import "./debugLoader";
// logo material loader. logo瓦片加载器
import "./logoLoader";
// normal material loader. 法向量瓦片加载器
import "./normalLoder";
//  wireframe material loader. wireframe网格瓦片加载器
import "./wireframeLoader";
// lerc geometry loader. Arcgis lerc瓦片加载器
import "./lercLoader";
// Quantized-Mesh loader. cesium Quantized-Mesh
import "./qmLoader";
// Single image loader. 单图像加载器
import "./singleImageLoader";
// Martini loader. Martini地形瓦片加载器
import "./martiniLoader";

// vierwer
export * from "./GLViewer";
// source chunk loader
export * from "./mapSource";
// fake earth mask
export * from "./fakeEarth";
