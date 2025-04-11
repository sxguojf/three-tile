/**
 * IndexDB 缓存
 */

import { Cache } from "three";

const DB_NAME = "three_cache";
const STORE_NAME = "files";

let db: IDBDatabase | null = null;

/**
 * 开启 IndexDB 缓存
 * @returns db实例
 */
export async function IndexDBCacheEable() {
	db = await initDB();
	Cache.enabled = true;
	return db;
}

const initDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);

		request.onupgradeneeded = event => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "key" });
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
};

Cache.add = async function (key: string, file: any): Promise<void> {
	if (!Cache.enabled || db === null) return;

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
		const request = store.put({ key, file: data });
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};

Cache.get = function (key: string): any {
	if (!Cache.enabled || db === null) return;

	const tx = db.transaction(STORE_NAME, "readonly");
	const store = tx.objectStore(STORE_NAME);
	const request = store.get(key);

	// todo：IndexDB 是异步操作，读取完成前可能返回undefined

	// let done = false;
	let result: any;
	request.onsuccess = () => {
		result = request.result;
		// done = true;
		// console.log("IndexDB data:", result);
	};
	request.onerror = event => {
		result = undefined;
		// done = true;
		console.error("Error retrieving data:", event);
	};

	if (result?.__type === "HTMLImageElement") {
		const img = new Image();
		img.src = result.dataURL;
		return img;
	}
	return result;
};

Cache.remove = async function (key: string): Promise<void> {
	if (!Cache.enabled || db === null) return;
	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);

	return new Promise<void>((resolve, reject) => {
		const request = store.delete(key);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};

Cache.clear = async function (): Promise<void> {
	if (!Cache.enabled || db === null) return;

	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);

	return new Promise<void>((resolve, reject) => {
		const request = store.clear();
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};
