import { Box2, BufferGeometry, MathUtils, PlaneGeometry } from "three";

import {
	FileLoaderEx,
	ITileGeometryLoader,
	LoaderFactory,
	getSafeTileUrlAndBounds,
	rect2ImageBounds,
} from "../../loader";

import { TileGridGeometry } from "../../geometry";
import { ISource } from "../../source";
import { Tile } from "../../tile";
import * as Lerc from "./lercDecode/LercDecode.es";

// Lerc.load({
// 	locateFile: (fn, dir) => {
// 		// const url = new URL("./lercDecode/lerc-wasm.wasm", import.meta.url).href;
// 		const url = new URL(`../../assets/${fn}`, import.meta.url).href;
// 		console.log(dir, fn, url);
// 		return url;
// 	},
// });

const emptyGeometry = new BufferGeometry();
/**
 * ArcGis-lerc格式瓦片几何体加载器
 * @link https://github.com/Esri/lerc
 */
export class TileGeometryLercLoader implements ITileGeometryLoader {
	public readonly dataType = "lerc";
	// 图像加载器
	private fileLoader = new FileLoaderEx(LoaderFactory.manager);

	public constructor() {
		this.fileLoader.setResponseType("arraybuffer");
	}

	// 加载瓦片几何体
	public load(source: ISource, tile: Tile, onLoad: () => void) {
		// 瓦片级别<8，不需要显示地形
		if (tile.coord.z < 8) {
			setTimeout(onLoad);
			return new PlaneGeometry();
		}
		// 计算最大级别瓦片和本瓦片在其中的位置
		const { url, bounds } = getSafeTileUrlAndBounds(source, tile);

		// 没有url，返回默认几何体
		if (!url) {
			setTimeout(onLoad);
			return emptyGeometry;
		}

		return this._load(tile, url, bounds, onLoad);
	}

	private _load(tile: Tile, url: any, bounds: Box2, onLoad: () => void) {
		// 计算瓦片图片大小（像素）
		let tileSize = tile.coord.z * 3;
		tileSize = MathUtils.clamp(tileSize, 2, 48);

		const geometry = new TileGridGeometry();

		this.fileLoader.load(
			url,
			// onLoad
			(buffer) => {
				this.decode(buffer).then((value: { width: number; dem: Float32Array }) => {
					// 从dem中取出rect范围内数据，并缩放到tileSize大小
					const { data, size } = this.clip(value.dem, value.width, bounds, tileSize);
					geometry.setData(data, size);
					onLoad();
				});
			},
			// onProgress
			undefined,
			// onError
			onLoad,
			tile.abortSignal,
		);
		return geometry;
	}

	private async decode(buffer: ArrayBuffer) {
		// if (!Lerc.isLoaded()) {
		// 	console.log("load Lerc decoder");
		// 	await Lerc.load({ locateFile: (path, _scriptDir) => `/src/plugin/lercLoader/lercDecode/${path}` });
		// }
		await Lerc.load();
		const pixelBlock = Lerc.decode(buffer);
		const { height, width, pixels } = pixelBlock;
		const dem = new Float32Array(height * width);
		for (let i = 0; i < dem.length; i++) {
			dem[i] = pixels[0][i] / 1000;
		}
		return { height, width, dem };
	}

	private clip(dem: Float32Array, demWidth: number, toRect: Box2, toSize: number) {
		// 计算剪裁区域
		const piexlRect = rect2ImageBounds(toRect, demWidth);
		// 剪裁一部分
		const subDem = arrayClip(dem, demWidth, piexlRect);
		// 缩放到指定大小
		const { data, width } = arrayResize(subDem, piexlRect.sw, piexlRect.sh, toSize, toSize);
		return { data, size: width };
	}
}

// 数组切片
function arrayClip(
	buffer: Float32Array,
	bufferWidth: number,
	rect: { sx: number; sy: number; sw: number; sh: number },
): Float32Array {
	const len = buffer.length;
	const result = new Float32Array(rect.sw * rect.sh);
	let index = 0;
	for (let i = 0; i < len; i++) {
		const ix = i % bufferWidth;
		const iy = Math.floor(i / bufferWidth);
		if (ix >= rect.sx && ix < rect.sx + rect.sw && iy >= rect.sy && iy < rect.sy + rect.sh) {
			result[index] = buffer[i];
			index++;
		}
	}
	return result;
}

/**
 * 双线性插值缩小数组，
 * todo: 可直接取临近点
 * 1、该函数用于计算地形几何体地形高度，线性插值放大没有意义，只会徒增计算量
 * 2、双线性也没有必要，最临近即可
 * @param buffer
 * @param bufferWidth
 * @param dw
 * @param dh
 * @returns
 */
function arrayResize(buffer: Float32Array, bufferWidth: number, bufferHeight: number, dw: number, dh: number) {
	// 如果源小于目标大小，直接返回源
	if (bufferWidth <= dw && bufferWidth <= dh) {
		return { data: buffer, width: bufferWidth, height: bufferHeight };
	}

	const result = new Float32Array(dw * dh);

	for (let y = 0; y < dh; y++) {
		for (let x = 0; x < dw; x++) {
			const source_x = Math.floor((x * bufferWidth) / dw);
			const source_y = Math.floor((y * bufferHeight) / dh);

			const source_x0 = Math.min(Math.max(source_x, 0), bufferWidth - 1);
			const source_y0 = Math.min(Math.max(source_y, 0), bufferHeight - 1);
			const source_x1 = source_x0 + 1;
			const source_y1 = source_y0 + 1;

			const q00 = buffer[source_y0 * bufferWidth + source_x0];
			const q01 = buffer[source_y0 * bufferWidth + source_x1];
			const q10 = buffer[source_y1 * bufferWidth + source_x0];
			const q11 = buffer[source_y1 * bufferWidth + source_x1];

			const fx = source_x - source_x0;
			const fy = source_y - source_y0;

			const q = q00 * (1 - fx) * (1 - fy) + q01 * fx * (1 - fy) + q10 * (1 - fx) * fy + q11 * fx * fy;

			result[y * dw + x] = q;
			if (isNaN(q)) {
				debugger;
			}
		}
	}

	return { data: result, width: dw, height: dh };
}
