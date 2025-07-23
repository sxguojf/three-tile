/**
 * IndexDB 缓存插件
 *
 * 使用：IndexDBCacheEable()
 */

import { Cache } from "three";

const DB_NAME = "three_cache";
const STORE_NAME = "files";

let db: IDBDatabase | null = null;

/**
 * 等待某个条件成立后继续执行
 * @param {() => boolean} conditionFn - 返回 boolean 的条件函数
 * @param {number} [checkInterval=100] - 检查间隔（毫秒）
 * @returns {Promise<void>} - 当条件成立时 resolve
 */
function waitFor(conditionFn: () => boolean, checkInterval: number = 100): Promise<void> {
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
 * 开启 IndexDB 缓存
 * @returns db实例
 */
export async function IndexDBCacheEable() {
	const initDB = (): Promise<IDBDatabase> => {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, 1);

			request.onupgradeneeded = event => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			};

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	};

	db = await initDB();
	Cache.enabled = true;
	return db;
}

Cache.add = async function (key: string, file: any): Promise<void> {
	if (!Cache.enabled || db === null || !key.startsWith("http")) return;

	// Convert HTMLImageElement to dataURL
	let data = file;
	if (file instanceof HTMLImageElement) {
		const canvas = document.createElement("canvas");
		canvas.width = file.naturalWidth;
		canvas.height = file.naturalHeight;
		const ctx = canvas.getContext("2d")!;
		ctx.drawImage(file, 0, 0);
		data = {
			__type: "HTMLImageElement",
			dataURL: canvas.toDataURL(),
		};
	}

	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);

	return new Promise<void>((resolve, reject) => {
		// console.log("Write indexDB:", data);
		const request = store.put({ id: key, file: data });
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};

Cache.get = function (key: string): any {
	if (!Cache.enabled || db === null || !key.startsWith("http")) return;

	const tx = db.transaction(STORE_NAME, "readonly");
	const store = tx.objectStore(STORE_NAME);
	const request = store.get(key);

	let result: any;
	let done = false;
	request.onsuccess = () => {
		result = request.result;
		done = true;
		if (result) {
			// console.log("Hit indexDB:", result);
		}
	};
	request.onerror = event => {
		result = undefined;
		done = true;
		console.error("Error retrieving data:", event);
	};

	if (result?.__type === "HTMLImageElement") {
		const img = new Image();
		img.src = result.dataURL;
		return img;
	}

	waitFor(() => done).then(() => {
		return result;
	});
};

// Cache.remove = async function (key: string): Promise<void> {
// 	if (!Cache.enabled || db === null) return;
// 	const tx = db.transaction(STORE_NAME, "readwrite");
// 	const store = tx.objectStore(STORE_NAME);

// 	return new Promise<void>((resolve, reject) => {
// 		const request = store.delete(key);
// 		request.onsuccess = () => resolve();
// 		request.onerror = () => reject(request.error);
// 	});
// };

// Cache.clear = async function (): Promise<void> {
// 	if (!Cache.enabled || db === null) return;

// 	const tx = db.transaction(STORE_NAME, "readwrite");
// 	const store = tx.objectStore(STORE_NAME);

// 	return new Promise<void>((resolve, reject) => {
// 		const request = store.clear();
// 		request.onsuccess = () => resolve();
// 		request.onerror = () => reject(request.error);
// 	});
// };
