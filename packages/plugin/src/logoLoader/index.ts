/**
 *@description: Plugin of LOGO Material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "three-tile";
import { TileMaterialLogoLoader } from "./TileMateriaLogoLoader";
// register
TileMap.registerImgLoader(new TileMaterialLogoLoader());
