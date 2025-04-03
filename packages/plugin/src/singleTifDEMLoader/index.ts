export * from "./TifDEMLoader";
export * from "./TifDEMSource";

import { TileMap } from "three-tile";
import { TifDEMLoder } from "./TifDEMLoader";

TileMap.registerDEMloader(new TifDEMLoder());
