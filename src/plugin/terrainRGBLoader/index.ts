import { LoaderFactory } from "../../loader";
import { TerrainRGBLoader } from "./TerrainRGBLoader";

LoaderFactory.registerGeometryLoader(new TerrainRGBLoader());
