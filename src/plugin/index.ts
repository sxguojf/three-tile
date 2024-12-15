/**
 *@description: three-tile plugin
 *@author: Guojf
 *@date: 2023-04-05
 */

// debug material loader
import "./debugLoader";
// logo material loader
import "./logoLoader";
// normal material loader
import "./normalLoder";
//  wireframe material loader
import "./wireframeLoader";
// lerc geometry loader，解决不了lerc的wasm加载问题，暂去掉该插件
import "./lercLoader";
// terrain-dem loader
// import "./demLoader";

// vierwer
export * from "./GLViewer";
// source chunk loader
export * from "./mapSource";
// fake earth mask
export * from "./fakeEarth";
