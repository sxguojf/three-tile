/**
 *@description: Plugin for terrain-RGB loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader";
import { TerrainRGBLoader } from "./TerrainRGBLoader";

LoaderFactory.registerGeometryLoader(new TerrainRGBLoader());
