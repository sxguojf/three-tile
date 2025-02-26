/**
 *@description: Plugin of normal loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileMateriaNormalLoader } from "./TileMateriaNormalLoader";
// register
LoaderFactory.registerMaterialLoader(new TileMateriaNormalLoader());
