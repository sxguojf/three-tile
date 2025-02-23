/**
 *@description: File loader with abort
 *@author: Guojf
 *@date: 2023-04-06
 */

import { CacheEx } from "./CacheEx.js";
import { LoadingManager, Loader } from "three";

class HttpError extends Error {
	public response;

	constructor(message: string, response: Response) {
		super(message);
		this.response = response;
	}
}

/**
 * overwriter threejs.FileLoader，add abortSignal to abort load
 */
export class FileLoaderEx extends Loader {
	mimeType?: string;
	responseType?: string;

	constructor(manager: LoadingManager) {
		super(manager);
	}

	load(
		url: string,
		onLoad?: (response: any) => void,
		_onProgress?: (request: ProgressEvent) => void,
		onError?: (event: ErrorEvent | DOMException) => void,
		abortSignal?: AbortSignal,
	) {
		if (this.path !== undefined) url = this.path + url;

		url = this.manager.resolveURL(url);

		const cached = CacheEx.get(url);

		if (cached) {
			// console.log("Hit net cache...");
			this.manager.itemStart(url);
			setTimeout(() => {
				if (onLoad) onLoad(cached);
				this.manager.itemEnd(url);
			});
			return cached;
		}

		if (abortSignal?.aborted) {
			console.log("aborted befor load");
			return;
		}

		// create request
		const req = new Request(url, {
			headers: new Headers(this.requestHeader),
			credentials: this.withCredentials ? "include" : "same-origin",
			// An abort controller could be added within a future PR
			signal: abortSignal,
		});

		// record states ( avoid data race )
		const mimeType = this.mimeType;
		const responseType = this.responseType;

		// start the fetch
		fetch(req)
			.then((response) => {
				if (response.status === 200 || response.status === 0) {
					// Some browsers return HTTP Status 0 when using non-http protocol
					// e.g. 'file://' or 'data://'. Handle as success.
					if (response.status === 0) {
						console.warn("THREE.FileLoader: HTTP Status 0 received.");
					}
					return response;
				} else {
					throw new HttpError(
						`fetch for "${response.url}" responded with ${response.status}: ${response.statusText}`,
						response,
					);
				}
			})
			.then((response) => {
				switch (responseType) {
					case "arraybuffer":
						return response.arrayBuffer();

					case "blob":
						return response.blob();

					case "document":
						return response.text().then((text) => {
							const parser = new DOMParser();
							return parser.parseFromString(text, mimeType as DOMParserSupportedType);
						});

					case "json":
						return response.json();

					default:
						if (mimeType === undefined) {
							return response.text();
						} else {
							// sniff encoding
							const re = /charset="?([^;"\s]*)"?/i;
							const exec = re.exec(mimeType);
							const label = exec && exec[1] ? exec[1].toLowerCase() : undefined;
							const decoder = new TextDecoder(label);
							return response.arrayBuffer().then((ab) => decoder.decode(ab));
						}
				}
			})
			.then((data) => {
				CacheEx.add(url, data);
				onLoad && onLoad(data);
			})
			.catch((err) => {
				onError && onError(err);
				if (err.name != "AbortError") {
					this.manager.itemError(url);
				} else {
					// console.log("Abort");
				}
			})
			.finally(() => {
				this.manager.itemEnd(url);
			});

		this.manager.itemStart(url);
	}

	setResponseType(value: string) {
		this.responseType = value;
		return this;
	}

	setMimeType(value: string) {
		this.mimeType = value;
		return this;
	}
}
