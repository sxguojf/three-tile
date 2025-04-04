/**
 *@description: All export
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { ITileGeometryLoader, ITileMaterialLoader } from "./loader";
declare const version: any, author: any;
export { version, author };
export * from "./tile";
export * from "./material";
export * from "./geometry";
export * from "./loader";
export * from "./source";
export * from "./map";
export declare function waitFor(condition: boolean, delay?: number): Promise<void>;
export declare function registerImgLoader(loader: ITileMaterialLoader): ITileMaterialLoader<import("three").Material>;
export declare function registerDEMLoader(loader: ITileGeometryLoader): ITileGeometryLoader<import("three").BufferGeometry<import("three").NormalBufferAttributes>>;
