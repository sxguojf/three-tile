/**
 *@description: Plugin of single-image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileMap } from "../../map";
import { SingleImageLoader } from "./SingleImageLoader";
TileMap.registerImgLoader(new SingleImageLoader());
export { SingleImageSource } from "./singleImageSource";
