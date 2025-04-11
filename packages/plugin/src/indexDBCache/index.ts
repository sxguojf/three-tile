import { Cache } from "three";
import { waitFor } from "three-tile";

const DB_NAME = "three_cache";
const STORE_NAME = "files";

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

let db: IDBDatabase | null = null;
initDB().then(database => {
	db = database;
	Cache.clear();
});

Cache.add = async function (key: string, file: any): Promise<void> {
	if (db === null) return;
	waitFor(!!db);

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
	if (db === null) return;
	waitFor(!!db);

	const tx = db.transaction(STORE_NAME, "readonly");
	const store = tx.objectStore(STORE_NAME);
	const request = store.get(key);
	const req = request as IDBRequest & { readyState: string };

	// waitFor(req.readyState !== "pending");

	const result = req.result()?.file;
	if (result?.__type === "HTMLImageElement") {
		const img = new Image();
		img.src = result.dataURL;
		return img;
	}
	return result;
};

Cache.remove = async function (key: string): Promise<void> {
	const db = await initDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);

	return new Promise<void>((resolve, reject) => {
		const request = store.delete(key);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};

Cache.clear = async function (): Promise<void> {
	const db = await initDB();
	const tx = db.transaction(STORE_NAME, "readwrite");
	const store = tx.objectStore(STORE_NAME);

	return new Promise<void>((resolve, reject) => {
		const request = store.clear();
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
};
