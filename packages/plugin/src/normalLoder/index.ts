/**
 *@description: Plugin of normal loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { registerImgLoader } from "three-tile";
import { TileMateriaNormalLoader } from "./TileMateriaNormalLoader";
// register
registerImgLoader(new TileMateriaNormalLoader());
