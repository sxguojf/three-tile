export * from "./TifDEMLoader";
export * from "./TifDEMSource";

import { TileMap } from "../../map";
import { TifDEMLoder } from "./TifDEMLoader";

TileMap.registerDEMloader(new TifDEMLoder());
