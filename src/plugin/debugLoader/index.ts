/**
 *@description: Debuge loader plugin

 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "../../map";
import { TileMaterialDebugeLoader } from "./DebugeLoader";

TileMap.registerImgLoader(new TileMaterialDebugeLoader());
