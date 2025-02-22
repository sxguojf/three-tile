import { getGeometryInfoFromDem } from "../../geometry";

export function parse(dem: Float32Array) {
	return getGeometryInfoFromDem(dem, true);
}

// 数组剪裁并缩放
export function arrayclipAndResize(
	buffer: Float32Array,
	bufferWidth: number,
	sx: number,
	sy: number,
	sw: number,
	sh: number,
	dw: number,
	dh: number,
) {
	// clip
	const clippedData = new Float32Array(sw * sh);
	for (let row = 0; row < sh; row++) {
		for (let col = 0; col < sw; col++) {
			const sourceIndex = (row + sy) * bufferWidth + (col + sx);
			const destIndex = row * sw + col;
			clippedData[destIndex] = buffer[sourceIndex];
		}
	}
	if (sw <= dw || sh <= dh) {
		return clippedData;
	}

	// resize
	const resizedData = new Float32Array(dh * dw);
	for (let row = 0; row < dw; row++) {
		for (let col = 0; col < dh; col++) {
			const destIndex = row * dh + col;
			const sourceX = Math.floor((col * sh) / dh);
			const sourceY = Math.floor((row * sw) / dw);
			const sourceIndex = sourceY * sw + sourceX;
			resizedData[destIndex] = clippedData[sourceIndex];
		}
	}

	return resizedData;
}
