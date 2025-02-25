/**
 *@description: Plugin of ArcGis-Lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileGeometryLercLoader } from "./TileGeometryLercLoader";

LoaderFactory.registerGeometryLoader(new TileGeometryLercLoader());
