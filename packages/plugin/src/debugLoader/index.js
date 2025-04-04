/**
 *@description: Debuge loader plugin

 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { registerImgLoader } from "three-tile";
import { TileMaterialDebugeLoader } from "./DebugeLoader";
registerImgLoader(new TileMaterialDebugeLoader());
