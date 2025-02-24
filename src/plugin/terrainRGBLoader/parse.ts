import { getGeometryDataFromDem } from "../../geometry";

export function parse(imgData: ImageData) {
	const dem = getDEMFromImage(imgData.data);
	return getGeometryDataFromDem(dem, true);
}

/**
 * 图像数据转DEM
 * @param imgData 图像数据
 * @returns DEM数组
 */
function getDEMFromImage(imgData: Uint8ClampedArray) {
	// RGB to height  (Mapbox Terrain-RGB v1)
	// https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-rgb-v1/
	function getZ(imgData: Uint8ClampedArray, i: number) {
		const index = i * 4;
		const [r, g, b, a] = imgData.slice(index, index + 4);
		// 透明像素直接返回高度0
		if (a === 0) {
			return 0;
		}
		const h = (r << 16) | (g << 8) | b;
		return h / 10000 - 10;
	}

	const count = imgData.length >>> 2;
	const dem = new Float32Array(count);
	for (let i = 0; i < count; i++) {
		dem[i] = getZ(imgData, i);
	}
	return dem;
}

/**
 * Get pixels in bounds from image and resize to targetSize
 * 从image中截取bounds区域子图像，缩放到targetSize大小，返回其中的像素数组
 * @param image 源图像
 * @param bounds clip bounds
 * @param targetSize dest size
 * @returns imgData
 */
export function getImageDataFromRect(
	image: HTMLImageElement,
	bounds: [number, number, number, number],
	targetSize: number,
) {
	/**
	 * Get bounds from rect
	 * @param rect
	 * @param imgSize
	 * @returns
	 */
	function rect2ImageBounds(clipBounds: [number, number, number, number], imgSize: number) {
		const bounds = clipBounds.map((bound) => bound + 0.5);
		// left-top
		const sx = Math.floor(bounds[0] * imgSize);
		const sy = Math.floor(bounds[1] * imgSize);
		// w and h
		const sw = Math.floor((bounds[2] - bounds[0]) * imgSize);
		const sh = Math.floor((bounds[3] - bounds[1]) * imgSize);
		return { sx, sy, sw, sh };
	}

	const cropRect = rect2ImageBounds(bounds, image.width);
	targetSize = Math.min(targetSize, cropRect.sw);
	const canvas = new OffscreenCanvas(targetSize, targetSize);
	const ctx = canvas.getContext("2d")!;
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(image, cropRect.sx, cropRect.sy, cropRect.sw, cropRect.sh, 0, 0, targetSize, targetSize);
	return ctx.getImageData(0, 0, targetSize, targetSize);
}
