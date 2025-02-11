/**
 *@description: register Quantized-Mesh tile geometry loader
 *@author: Guojf
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { QuantizedMeshTileLoader } from "./TileGeometryQuantizedLoader";

LoaderFactory.registerGeometryLoader(new QuantizedMeshTileLoader());
