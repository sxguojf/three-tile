export * from "./TifDEMLoader";
export * from "./TifDEMSource";
import { registerDEMLoader } from "three-tile";
import { TifDEMLoder } from "./TifDEMLoader";
registerDEMLoader(new TifDEMLoder());
