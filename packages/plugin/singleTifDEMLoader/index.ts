export * from "./TifDEMLoader";
export * from "./TifDEMSource";

import { registerDEMLoader } from "../..";
import { TifDEMLoder } from "./TifDEMLoader";

registerDEMLoader(new TifDEMLoder());
