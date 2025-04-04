/**
 *@description: Plugin of terrain-RGB loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { registerDEMLoader } from "../..";
import { TerrainRGBLoader } from "./TerrainRGBLoader";
registerDEMLoader(new TerrainRGBLoader());
