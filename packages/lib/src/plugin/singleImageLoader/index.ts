/**
 *@description: Plugin of single-image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "../../map/TileMap";
import { SingleImageLoader } from "./SingleImageLoader";
export { SingleImageSource } from "./SingleImageSource1";

TileMap.registerImgLoader(new SingleImageLoader());
