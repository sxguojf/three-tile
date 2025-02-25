/**
 *@description: Plugin of Wireframe material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileMaterialWrieLoader } from "./TileMaterialWrieLoader";

// register
LoaderFactory.registerMaterialLoader(new TileMaterialWrieLoader());
