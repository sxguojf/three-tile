/**
 *@description: three-tile plugin
 *@author: 郭江峰
 *@date: 2023-04-05
 */

/*-------------------------------------------------------------------
                        loader 加载器
---------------------------------------------------------------------*/
// tile raster image loader. 通用影像材质瓦片加载器
import "./tileImageLoader";
// Mapbox terrain-rgb loader. Mapbox terrain-rgb格式地形瓦片加载器
import "./terrainRGBLoader";
// debug material loader. 调试材质瓦片加载器
import "./debugLoader";
// logo material loader. logo材质瓦片加载器
import "./logoLoader";
// normal material loader. 法向量材质瓦片加载器
import "./normalLoder";
//  wireframe material loader. wireframe网格瓦片加载器
import "./wireframeLoader";
// lerc geometry loader. Arcgis lerc地形瓦片加载器
export * from "./lercLoader";
// Quantized-Mesh loader. cesium Quantized-Mesh地形瓦片加载器
import "./qmLoader";
// Single image loader. 单图像材质加载器
import "./singleImageLoader";
// Martini loader. Martini地形瓦片加载器
import "./martiniLoader";

/*-------------------------------------------------------------------
                        utils 辅助工具
---------------------------------------------------------------------*/
// vierwer. threejs 3D 场景创建类
export * from "./GLViewer";
// source chunk loader. 一些常见瓦片数据源定义
export * from "./mapSource";
// fake earth mask. 地球球体遮罩
export * from "./fakeEarth";

export * from "./fog";
// map extension. 地图扩展功能
import "./mapExtension";

/*-------------------------------------------------------------------
                        加载默认插件
---------------------------------------------------------------------*/
import { use } from "./PluginSDK";
import { lerc } from "./lercLoader";
(async () => {
	await use(lerc);
})();
