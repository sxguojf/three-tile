import { LoaderFactory } from "../../loader";
import { TileGeometryMartiniLoader } from "./TileGeometryMartiniLoader";

LoaderFactory.registerGeometryLoader(new TileGeometryMartiniLoader());
