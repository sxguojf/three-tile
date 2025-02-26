/**
 *@description: Quantized-Mesh tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { QuantizedMeshTileLoader } from "./TileGeometryQmLoader";

LoaderFactory.registerGeometryLoader(new QuantizedMeshTileLoader());
