export type DEMType = {
	buffer: Float32Array;
	width: number;
	height: number;
};

/**
 * 解析 DEM 数据
 * @param data 包含 DEM 数据的对象，包含 buffer、width 和 height 属性
 * @param sourceBounds 原始数据的边界范围 [xMin, yMin, xMax, yMax]
 * @param clipBounds 需要提取的区域的边界范围 [xMin, yMin, xMax, yMax]
 * @param targetWidth 目标数据的宽度，默认为 64
 * @param targetHeight 目标数据的高度，默认为 64
 * @returns 提取并缩放后的 Float32Array 数据
 */
export function parse(
	data: DEMType,
	sourceBounds: [number, number, number, number],
	clipBounds: [number, number, number, number],
	targetWidth: number = 64,
	targetHeight: number = 64,
) {
	// 解构原始数据的边界范围
	const [sxMin, syMin, sxMax, syMax] = sourceBounds;
	// 解构需要提取的区域的边界范围
	const [dxMin, dyMin, dxMax, dyMax] = clipBounds;

	// 计算 x 方向的缩放比例
	const xScale = data.width / (sxMax - sxMin);
	// 计算 y 方向的缩放比例
	const yScale = data.height / (syMax - syMin);

	// 投影坐标转图像坐标，计算起始点的 x 坐标
	const x1 = (dxMin - sxMin) * xScale;
	// 投影坐标转图像坐标，计算起始点的 y 坐标
	const y1 = (syMax - dyMax) * yScale;

	// 投影坐标转图像坐标，计算结束点的 x 坐标
	const x2 = (dxMax - sxMin) * xScale;
	// 投影坐标转图像坐标，计算结束点的 y 坐标
	const y2 = (syMax - dyMin) * yScale;

	// 定义提取区域的边界
	const subBounds = [x1, y1, x2, y2] as [number, number, number, number];

	// 调用 extractAndScaleFloat32Data 函数进行数据提取和缩放
	return extractAndScaleFloat32Data(data.buffer, data.width, data.height, subBounds, targetWidth, targetHeight, 0);
}

/**
 * 从缓冲区提取指定区域数据并缩放到目标大小
 * @param buffer 原始数据缓冲区 (按行优先存储)
 * @param srcWidth 原始数据宽度
 * @param srcHeight 原始数据高度
 * @param subBounds 要提取的区域 [x1, y1, x2, y2] (相对于原始数据的坐标)
 * @param targetWidth 目标宽度
 * @param targetHeight 目标高度
 * @param fillValue 可选，超出范围时填充的值（默认为 NaN）
 * @returns 缩放后的 float32 数组
 */
function extractAndScaleFloat32Data(
	buffer: Float32Array,
	srcWidth: number,
	srcHeight: number,
	subBounds: [number, number, number, number],
	targetWidth: number,
	targetHeight: number,
	fillValue: number = 0,
): Float32Array {
	// 参数校验，确保缓冲区长度与宽度和高度匹配
	if (buffer.length !== srcWidth * srcHeight) {
		throw new Error("Buffer size does not match width and height");
	}

	// 解构提取区域的边界
	const [x1, y1, x2, y2] = subBounds;
	// 计算起始点的 x 坐标
	const startX = Math.min(x1, x2);
	// 计算结束点的 x 坐标
	const endX = Math.max(x1, x2);
	// 计算起始点的 y 坐标
	const startY = Math.min(y1, y2);
	// 计算结束点的 y 坐标
	const endY = Math.max(y1, y2);

	// 创建目标数组，用于存储缩放后的数据
	const result = new Float32Array(targetWidth * targetHeight);

	// 计算 x 方向的缩放比例
	const scaleX = (endX - startX) / targetWidth;
	// 计算 y 方向的缩放比例
	const scaleY = (endY - startY) / targetHeight;

	// 遍历目标数组，双线性插值计算每个目标点的值
	for (let y = 0; y < targetHeight; y++) {
		for (let x = 0; x < targetWidth; x++) {
			// 计算当前目标点在原始数据中的 x 坐标
			const srcX = startX + x * scaleX;
			// 计算当前目标点在原始数据中的 y 坐标
			const srcY = startY + y * scaleY;

			// 计算当前目标点在结果数组中的索引
			const index = y * targetWidth + x;

			// 检查当前点是否越界
			if (srcX < 0 || srcX >= srcWidth || srcY < 0 || srcY >= srcHeight) {
				// 越界则填充指定值
				result[index] = fillValue;
				continue;
			}

			// 获取当前点的四个邻近点的整数坐标
			const x1 = Math.floor(srcX);
			const y1 = Math.floor(srcY);
			const x2 = Math.min(x1 + 1, srcWidth - 1);
			const y2 = Math.min(y1 + 1, srcHeight - 1);

			// 瓦片边缘点不插值，直接取值
			const onEdge = x1 > startX && x1 < endX && y1 > startY && y1 < endY;
			if (!onEdge) {
				result[index] = buffer[y1 * srcWidth + x1] + 1000; // fillValue;
				continue;
			}

			// 计算当前点相对于四个邻近点的偏移量
			const dx = srcX - x1;
			const dy = srcY - y1;
			// 获取四个邻近点的值
			const q11 = buffer[y1 * srcWidth + x1];
			const q12 = buffer[y2 * srcWidth + x1];
			const q21 = buffer[y1 * srcWidth + x2];
			const q22 = buffer[y2 * srcWidth + x2];

			// 双线性插值计算当前点的值
			const value = q11 * (1 - dx) * (1 - dy) + q21 * dx * (1 - dy) + q12 * (1 - dx) * dy + q22 * dx * dy;

			console.assert(!isNaN(value));

			result[index] = value + 1000;
		}
	}

	return result;
}
