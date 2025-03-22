/**
 *@description: Plugin of ArcGis-Lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "../../map/TileMap";
import { TileGeometryLercLoader } from "./TileGeometryLercLoader";

TileMap.registerDEMloader(new TileGeometryLercLoader());
