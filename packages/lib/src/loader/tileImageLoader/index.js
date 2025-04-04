/**
 *@description: Plugin form image tile loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { TileImageLoader } from "./TileImageLoader";
import { registerImgLoader } from "../..";
registerImgLoader(new TileImageLoader());
