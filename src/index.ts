/**
 *@description: All export
 *@author: 郭江峰
 *@date: 2023-04-05
 */

export { version, author } from "../package.json";

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

// export * from "./plugin/PluginSDK";

// build-in plugin
import * as plugin from "./plugin";
export { plugin };

// export async function waitingForLoaded(condition: boolean, delay = 100): Promise<void> {
// 	while (!condition) {
// 		await new Promise((resolve) => setTimeout(resolve, delay));
// 	}
// }
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
