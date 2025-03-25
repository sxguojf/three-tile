export type DEMType = {
	demArray: Float32Array;
	width: number;
	height: number;
};

export function parse(
	data: DEMType,
	sourceBounds: [number, number, number, number],
	clipBounds: [number, number, number, number],
	targetWidth: number = 64,
	targetHeight: number = 64,
) {
	const [sxMin, syMin, sxMax, syMax] = sourceBounds;
	const [dxMin, dyMin, dxMax, dyMax] = clipBounds;

	const xScale = (sxMax - sxMin) / data.width;
	const yScale = (syMax - syMin) / data.height;

	const sx = (dxMin - sxMin) / xScale;
	const sy = (syMax - dyMax) / yScale;

	const sWidth = (dxMax - dxMin) / xScale;
	const sHeight = (dyMax - dyMin) / yScale;

	console.log(sx, sy, sWidth, sHeight);

	return arrayclipAndResize(
		data.demArray,
		data.width,
		data.height,
		sx,
		sy,
		sWidth,
		sHeight,
		targetWidth,
		targetHeight,
	);
}
/**
 * 从 sourceBuffer 中提取数据并重采样到目标大小（最近邻插值 + 边界填充）
 * @param sourceBuffer 输入的 Float32Array 数据
 * @param sourceWidth 原始数据的宽度
 * @param sourceHeight 原始数据的高度
 * @param sx 源数据的起始 x 坐标
 * @param sy 源数据的起始 y 坐标
 * @param sWidth 源数据的截取宽度
 * @param sHeight 源数据的截取高度
 * @param dWidth 目标数据的宽度
 * @param dHeight 目标数据的高度
 * @param fillValue 范围外的填充值（默认为 0）
 * @returns 处理后的 Float32Array 数据
 */
function arrayclipAndResize(
	sourceBuffer: Float32Array,
	sourceWidth: number,
	sourceHeight: number,
	sx: number,
	sy: number,
	sWidth: number,
	sHeight: number,
	dWidth: number,
	dHeight: number,
	fillValue: number = 0,
): Float32Array {
	// 创建目标缓冲区（自动初始化为0）
	const destBuffer = new Float32Array(dWidth * dHeight).fill(fillValue);

	// 计算缩放比例
	const xScale = sWidth / dWidth;
	const yScale = sHeight / dHeight;

	// 源数据有效区域边界
	const sourceEndX = sx + sWidth;
	const sourceEndY = sy + sHeight;

	// 最近邻插值采样
	for (let dy = 0; dy < dHeight; dy++) {
		for (let dx = 0; dx < dWidth; dx++) {
			// 计算对应的源坐标
			const srcX = Math.round(sx + dx * xScale);
			const srcY = Math.round(sy + dy * yScale);

			// 检查是否在源数据有效范围内
			if (
				srcX >= sx &&
				srcX < sourceEndX &&
				srcY >= sy &&
				srcY < sourceEndY &&
				srcX < sourceWidth &&
				srcY < sourceHeight
			) {
				const index = srcY * sourceWidth + srcX;
				let h = sourceBuffer[index];
				if (isNaN(h)) {
					// console.log(srcY * sourceWidth + srcX);
					h = 0;
				}
				destBuffer[dy * dWidth + dx] = h;
			}
		}
	}

	return destBuffer;
}
