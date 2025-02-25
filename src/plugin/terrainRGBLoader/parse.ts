/**
 *@description: Terrain-RGB parse
 *@author: 郭江峰
 *@date: 2023-04-05
 */

export function parse(imgData: ImageData) {
	return getDEMFromImage(imgData.data);
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
