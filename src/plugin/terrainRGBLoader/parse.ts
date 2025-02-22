import { getGeometryInfoFromDem } from "../../geometry";

export function parse(imgData: ImageData) {
	const dem = Img2dem(imgData.data);
	return getGeometryInfoFromDem(dem, true);
}

// RGB to dem (Mapbox Terrain-RGB v1)
// https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-rgb-v1/
function getZ(imgData: Uint8ClampedArray, i: number) {
	// 透明像素直接返回高度0
	if (imgData[i * 4 + 3] === 0) {
		return 0;
	}
	// height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)
	const r = imgData[i * 4];
	const g = imgData[i * 4 + 1];
	const b = imgData[i * 4 + 2];
	const h = (r << 16) | (g << 8) | b;
	return h / 10000 - 10;
}

function Img2dem(imgData: Uint8ClampedArray) {
	const count = imgData.length >>> 2;
	const dem = new Float32Array(count);
	for (let i = 0; i < count; i++) {
		dem[i] = getZ(imgData, i);
	}
	return dem;
}
