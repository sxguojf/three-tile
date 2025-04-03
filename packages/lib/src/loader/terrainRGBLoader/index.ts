/**
 *@description: Plugin of terrain-RGB loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "../../map/TileMap";
import { TerrainRGBLoader } from "./TerrainRGBLoader";

TileMap.registerDEMloader(new TerrainRGBLoader());
