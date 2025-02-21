import { getGeometryInfoFromDem } from "../../geometry";

export function parse(dem: Float32Array) {
	return getGeometryInfoFromDem(dem, true);
}

// 数组剪裁并缩放
export function ArrayclipAndResize(
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
	const cdata = new Float32Array(sw * sh);
	for (let i = 0; i < sh; i++) {
		for (let j = 0; j < sw; j++) {
			const sourceIndex = (i + sy) * bufferWidth + (j + sx);
			const destIndex = i * sw + j;
			cdata[destIndex] = buffer[sourceIndex];
		}
	}
	if (sw <= dw || sh <= dh) {
		return cdata;
	}

	// resize
	const sdata = new Float32Array(dh * dw);
	for (let i = 0; i < dw; i++) {
		for (let j = 0; j < dh; j++) {
			const destIndex = i * dh + j;
			const sourceX = Math.floor((j * sh) / dh);
			const sourceY = Math.floor((i * sw) / dw);
			const sourceIndex = sourceY * sw + sourceX;
			sdata[destIndex] = cdata[sourceIndex];
		}
	}

	return sdata;
}
