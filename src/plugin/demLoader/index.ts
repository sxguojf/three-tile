import { LoaderFactory } from "../../loader";
import { TileGeometryDEMLoader } from "./TileGeometryDEMLoader";

LoaderFactory.registerGeometryLoader(new TileGeometryDEMLoader());
