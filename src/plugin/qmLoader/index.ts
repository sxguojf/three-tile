/**
 *@description: Quantized-Mesh tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "../../map";
import { QuantizedMeshTileLoader } from "./TileGeometryQmLoader";

TileMap.registerDEMloader(new QuantizedMeshTileLoader());
