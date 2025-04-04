/**
 *@description: Plugin of ArcGis-Lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { registerDEMLoader } from "../..";
import { TileGeometryLercLoader } from "./TileGeometryLercLoader";
registerDEMLoader(new TileGeometryLercLoader());
