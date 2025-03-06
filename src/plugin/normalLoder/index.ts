/**
 *@description: Plugin of normal loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "../../map";
import { TileMateriaNormalLoader } from "./TileMateriaNormalLoader";
// register
TileMap.registerImgLoader(new TileMateriaNormalLoader());
