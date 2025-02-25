/**
 *@description: Image loader whit abort, base threejs
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Loader, LoadingManager } from "three";
import { FileLoaderEx } from "./FileLoaderEx";
import { LoaderFactory } from "./LoaderFactory";

// empty image
const EMPTYIMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 *  image load with abording
 *
 * orverwrite threejs.ImageLoader，load using fetch，added abortSignal to abort load.
 *
 * https://github.com/mrdoob/three.js/issues/10439#issuecomment-275785639
 * 因fetch下载图像有一些问题，threej在r83回滚，使用Image加载图像，Image无法中止，故重新该类添加中止下载标志。
 */
export class ImageLoaderEx extends Loader {
	private loader = new FileLoaderEx(LoaderFactory.manager);

	public constructor(manager: LoadingManager) {
		super(manager);
		this.loader.setResponseType("blob");
	}
	/**
	 * load image
	 * @param url imageurl
	 * @param onLoad callback when loaded and abort and error
	 * @param onProgress callback when progress
	 * @param onError callback when error
	 * @param abortSignal signal of abort loading
	 * @returns image
	 */
	load(
		url: string,
		onLoad?: (image: HTMLImageElement) => void,
		onProgress?: (event: ProgressEvent) => void,
		onError?: (event: ErrorEvent | DOMException | Event) => void,
		abortSignal?: AbortSignal,
	): HTMLImageElement {
		const image = new Image();

		const onImageLoad = (_event: Event) => {
			removeEventListeners();
			onLoad && onLoad(image);
		};

		const onImageError = (event: ErrorEvent) => {
			removeEventListeners();
			if (onError) onError(event);
			image.src = EMPTYIMAGE;
		};

		const removeEventListeners = () => {
			image.removeEventListener("load", onImageLoad, false);
			image.removeEventListener("error", onImageError, false);
		};
		image.addEventListener("load", onImageLoad, false);
		image.addEventListener("error", onImageError, false);

		const fetchOptions: RequestInit = {};
		fetchOptions.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include";
		fetchOptions.headers = this.requestHeader;

		fetchOptions.signal = abortSignal;

		this.loader.load(
			url,
			(blob: any) => {
				if (onLoad) {
					image.src = URL.createObjectURL(blob);
				}
			},
			onProgress,
			onError,
			abortSignal,
		);
		return image;
	}
}
