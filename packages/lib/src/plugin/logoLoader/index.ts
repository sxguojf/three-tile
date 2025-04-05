/**
 *@description: Plugin of LOGO Material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { registerImgLoader } from "../..";
import { TileMaterialLogoLoader } from "./TileMateriaLogoLoader";
// register
registerImgLoader(new TileMaterialLogoLoader());
