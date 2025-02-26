/**
 *@description: Plugin of Mapbox terrain-RGB with martini tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader";
import { TileGeometryMartiniLoader } from "./TileGeometryMartiniLoader";

LoaderFactory.registerGeometryLoader(new TileGeometryMartiniLoader());
