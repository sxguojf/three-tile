/**
 *@description: register Quantized-Mesh tile geometry loader
 *@author: Guojf
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { QuantizedMeshTileLoader } from "./TileGeometryQmLoader";

LoaderFactory.registerGeometryLoader(new QuantizedMeshTileLoader());
