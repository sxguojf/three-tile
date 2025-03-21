/**
 *@description: All export
 *@author: 郭江峰
 *@date: 2023-04-05
 */
export { version, author } from "../../../package.json";
export * from "./tile";
export * from "./material";
export * from "./geometry";
export * from "./loader";
export * from "./source";
export * from "./map";
import * as plugin from "./plugin";
export { plugin };
export declare function waitFor(condition: boolean, delay?: number): Promise<void>;
