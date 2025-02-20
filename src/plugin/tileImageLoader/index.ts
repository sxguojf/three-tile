import { LoaderFactory } from "../../loader";
import { TileImageLoader } from "./TileImageLoader";

LoaderFactory.registerMaterialLoader(new TileImageLoader());
