/**
 *@description: Plugin for Mapbox terrain-RGB with martini tile geometry loader
 *@author: Guojf
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader";
import { TileGeometryMartiniLoader } from "./TileGeometryMartiniLoader";

LoaderFactory.registerGeometryLoader(new TileGeometryMartiniLoader());
