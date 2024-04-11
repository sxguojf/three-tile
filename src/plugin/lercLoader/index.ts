/**
 *@description: register ArcGis-lerc tile geometry loader
 *@author: Guojf
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../..";
import { TileGeometryLercLoader } from "./TileGeometryLercLoader";

LoaderFactory.registerGeometryLoader(new TileGeometryLercLoader());
