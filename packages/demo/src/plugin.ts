import * as tt from "three-tile";
// import * as ttp from "three-tile-plugin";
import "three-tile-plugin";

import { GeoJSONLoader, MVTLoader } from "./vectorTile/index";

// 注册GeoJSON加载器
tt.TileMap.registerImgLoader(new GeoJSONLoader());
// // 注册MVT加载器
tt.TileMap.registerImgLoader(new MVTLoader());
