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

import { BufferGeometry, Material } from "three";
import { ITileGeometryLoader, ITileMaterialLoader, LoaderFactory } from "./loader";

/**
 * 等待某个条件成立后继续执行
 * @param {() => boolean} conditionFn - 返回 boolean 的条件函数
 * @param {number} [checkInterval=100] - 检查间隔（毫秒）
 * @returns {Promise<void>} - 当条件成立时 resolve
 */
export function waitFor(conditionFn: () => boolean, checkInterval: number = 100): Promise<void> {
	return new Promise(resolve => {
		const checkCondition = () => {
			if (conditionFn()) {
				resolve(); // 条件成立，结束等待
			} else {
				setTimeout(checkCondition, checkInterval); // 继续轮询
			}
		};
		checkCondition(); // 开始检查
	});
}

/**
 * 注册影像加载器
 * @param loader 要注册的影像加载器
 * @returns 加载器
 */
export function registerImgLoader(loader: ITileMaterialLoader) {
	LoaderFactory.registerMaterialLoader(loader);
	return loader;
}

/**
 * 注册地形加载器
 * @param loader 要注册的地形加载器
 * @returns 加载器
 */
export function registerDEMLoader(loader: ITileGeometryLoader) {
	LoaderFactory.registerGeometryLoader(loader);
	return loader;
}

/**
 * 取得影像加载器
 * @param dateType 数据类型
 * @returns 加载器
 */
export function getImgLoader<T extends ITileMaterialLoader<Material>>(dateType: string) {
	return LoaderFactory.getMaterialLoader(dateType) as T;
}

/**
 * 取得地形加载器
 * @param dateType 数据类型
 * @returns 加载器
 */
export function getDEMLoader<T extends ITileGeometryLoader<BufferGeometry>>(dateType: string) {
	return LoaderFactory.getGeometryLoader(dateType) as T;
}

/**
 * 取得瓦片加载器列表
 * @returns 加载器列表
 */
export function getTileLoaders() {
	return LoaderFactory.getLoaders();
}
