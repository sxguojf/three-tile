/**
 *@description: Plugin of single-image loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { registerImgLoader } from "../..";
import { SingleImageLoader } from "./SingleImageLoader";
export { SingleImageSource } from "./SingleImageSource";

registerImgLoader(new SingleImageLoader());
