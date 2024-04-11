/**
 *@description: register Wireframe material loader
 *@author: Guojf
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileMaterialWrieLoader } from "./TileMaterialWrieLoader";

// register
LoaderFactory.registerMaterialLoader(new TileMaterialWrieLoader());
