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
	const rgb = (imgData[i * 4] << 16) | (imgData[i * 4 + 1] << 8) | imgData[i * 4 + 2];
	return rgb / 10000 - 10;
}

function Img2dem(imgData: Uint8ClampedArray) {
	const count = Math.floor(imgData.length / 4);
	const dem = new Float32Array(count);
	for (let i = 0; i < dem.length; i++) {
		dem[i] = getZ(imgData, i);
	}
	return dem;
}
