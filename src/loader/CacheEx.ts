/**
 *@description: Cache for File loader
 *@reference https://threejs.org/docs/index.html?q=cache#api/zh/loaders/Cache
 *@author: 郭江峰
 *@date: 2023-04-06
 */

/**
 * Overwrite threejs.Cache，added cache file count
 */
export class CacheEx {
	public static enabled = true;
	public static size = 200;
	protected static files = new Map<string, any>();

	public static add(key: string, data: any) {
		if (!this.enabled) return;
		if (this.files.has(key)) {
			// console.error("Duplicate");
			return;
		}
		this.files.set(key, data);
		const keys = Array.from(this.files.keys());
		const count = this.files.size - this.size;
		for (let i = 0; i < count; i++) {
			this.remove(keys[i]);
		}

		console.assert(this.files.size <= this.size);
	}

	public static get(key: string) {
		if (!this.enabled) return;
		return this.files.get(key);
	}

	public static remove(key: string) {
		this.files.delete(key);
	}

	public static clear() {
		this.files.clear();
	}
}
