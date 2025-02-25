/**
 *@description: Debuge loader
 *@author: Guojf
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileMaterialDebugeLoader } from "./DebugeLoader";

LoaderFactory.registerMaterialLoader(new TileMaterialDebugeLoader());
