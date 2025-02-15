/**
 *@description: register single-image
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { SingleImageLoader } from "./SingleImageLoader";
// register
LoaderFactory.registerMaterialLoader(new SingleImageLoader());
