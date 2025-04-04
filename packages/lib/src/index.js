/**
 *@description: All export
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { LoaderFactory } from "./loader";
import pkg from "../package.json?raw";
const { version, author } = JSON.parse(pkg);
export { version, author };
// core
export * from "./tile";
// material
export * from "./material";
// geometry
export * from "./geometry";
// loader
export * from "./loader";
// source
export * from "./source";
// map
export * from "./map";
// export * as plugin from "./plugin";
export function waitFor(condition, delay = 100) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (condition) {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}
export function registerImgLoader(loader) {
    LoaderFactory.registerMaterialLoader(loader);
    return loader;
}
export function registerDEMLoader(loader) {
    LoaderFactory.registerGeometryLoader(loader);
    return loader;
}
