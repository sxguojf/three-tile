/**
 *@description: Plugin of Wireframe material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { registerImgLoader } from "../..";
import { TileMaterialWrieLoader } from "./TileMaterialWrieLoader";

// register
registerImgLoader(new TileMaterialWrieLoader());
