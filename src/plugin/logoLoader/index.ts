/**
 *@description: register LOGO Material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileMaterialLogoLoader } from "./TileMateriaLogoLoader";
// register
LoaderFactory.registerMaterialLoader(new TileMaterialLogoLoader());
