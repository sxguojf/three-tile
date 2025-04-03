/**
 *@description: All export
 *@author: 郭江峰
 *@date: 2023-04-05
 */

export { version, author } from "../package.json";
// export const version = "0.10.0";
// export const author = {
// 	name: "GuoJF",
// 	email: "hz_gjf@163.com",
// };
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

export * as plugin from "./plugin";

export function waitFor(condition: boolean, delay = 100) {
	return new Promise<void>((resolve) => {
		const interval = setInterval(() => {
			if (condition) {
				clearInterval(interval);
				resolve();
			}
		}, delay);
	});
}
