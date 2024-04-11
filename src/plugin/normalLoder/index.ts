/**
 *@description: register normal loader
 *@author: Guojf
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileMateriaNormalLoader } from "./TileMateriaNormalLoader";
// register
LoaderFactory.registerMaterialLoader(new TileMateriaNormalLoader());
