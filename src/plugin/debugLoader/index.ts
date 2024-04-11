import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileMaterialDebugeLoader } from "./DebugeLoader";

LoaderFactory.registerMaterialLoader(new TileMaterialDebugeLoader());
