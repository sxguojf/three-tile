/**
 *@description: Plugin of Wireframe material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "three-tile";
import { TileMaterialWrieLoader } from "./TileMaterialWrieLoader";

// register
TileMap.registerImgLoader(new TileMaterialWrieLoader());
