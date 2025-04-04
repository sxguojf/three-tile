import * as tt from "three-tile";

// 加载所有内置插件
import "three-tile-plugin";

import { GeoJSONLoader, MVTLoader } from "./vectorTile/index";
// 注册GeoJSON加载器
tt.registerImgLoader(new GeoJSONLoader());
// // 注册MVT加载器
tt.registerImgLoader(new MVTLoader());
