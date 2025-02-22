import { Box2 } from "three";

import { FileLoaderEx, ITileGeometryLoader, LoaderFactory, getSafeTileUrlAndBounds } from "../../loader";

import { GeometryDataType, TileGeometry } from "../../geometry";
import { ISource } from "../../source";
import * as Lerc from "./lercDecode/LercDecode.es";
import { parse } from "./parse";
import ParseWorker from "./parse.worker?worker&inline";

/**
 * ArcGis-lerc格式瓦片几何体加载器
 * @link https://github.com/Esri/lerc
 */
export class TileGeometryLercLoader implements ITileGeometryLoader {
	public readonly dataType = "lerc";
	private _useWorker = true;
	/** get use worker */
	public get useWorker() {
		return this._useWorker;
	}
	/** set use worker */
	public set useWorker(value: boolean) {
		this._useWorker = value;
	}
	// 图像加载器
	private fileLoader = new FileLoaderEx(LoaderFactory.manager);

	public constructor() {
		this.fileLoader.setResponseType("arraybuffer");
	}

	// 加载瓦片几何体
	public load(source: ISource, x: number, y: number, z: number, onLoad: () => void, abortSignal: AbortSignal) {
		const geometry = new TileGeometry();
		// 计算最大级别瓦片和本瓦片在其中的位置
		const { url, bounds } = getSafeTileUrlAndBounds(source, x, y, z);

		// 没有url，返回默认几何体
		if (!url) {
			setTimeout(onLoad);
			return geometry;
		}

		// 加载瓦片
		return this._load(url, geometry, z, bounds, onLoad, abortSignal);
	}

	private async decode(buffer: ArrayBuffer) {
		if (!Lerc.isLoaded()) {
			// await Lerc.load({
			// 	locateFile: (wasmFileName?: string | undefined, _scriptDir?: string | undefined) => `./${wasmFileName}`,
			// });
			await Lerc.load();
		}

		const pixelBlock = Lerc.decode(buffer);
		const { height, width, pixels } = pixelBlock;
		const dem = new Float32Array(height * width);
		for (let i = 0; i < dem.length; i++) {
			dem[i] = pixels[0][i] / 1000;
		}
		return { dem, width, height };
	}

	private _load(
		url: string,
		geometry: TileGeometry,
		z: number,
		bounds: Box2,
		onLoad: () => void,
		abortSignal: AbortSignal,
	) {
		this.fileLoader.load(
			url,
			// onLoad
			(buffer) => {
				this.decode(buffer).then((decodedData: { dem: Float32Array; width: number; height: number }) => {
					const data = {
						dem: decodedData.dem,
						width: decodedData.width,
						height: decodedData.height,
						z: z,
					};
					// 地形从父瓦片取需要剪裁
					if (bounds.max.x - bounds.min.x < 1) {
						// 从父瓦片取地形数据
						const subDEM = getSubDEM(decodedData, bounds);
						data.dem = subDEM.dem;
						data.width = subDEM.width;
						data.height = subDEM.height;
					}

					console.assert(data.dem.length === data.width * data.height);

					// 是否使用worker解析
					if (this.useWorker) {
						const worker = new ParseWorker();
						worker.onmessage = (e: MessageEvent<GeometryDataType>) => {
							geometry.setData(e.data);
							onLoad();
						};
						worker.postMessage(data);
					} else {
						const geoInfo = parse(data);
						geometry.setData(geoInfo);
						onLoad();
					}
				});
			},
			undefined, // onProgress
			onLoad, // onError
			abortSignal,
		);
		return geometry;
	}
}

function getSubDEM(decodedData: { dem: Float32Array; width: number; height: number }, bounds: Box2) {
	function rect2ImageBounds(rect: Box2, width: number, height: number) {
		rect.min.x += 0.5;
		rect.max.x += 0.5;
		rect.min.y += 0.5;
		rect.max.y += 0.5;
		// left-top
		const sx = Math.floor(rect.min.x * width);
		const sy = Math.floor(rect.min.y * height);
		// w and h
		const sw = Math.floor((rect.max.x - rect.min.x) * width);
		const sh = Math.floor((rect.max.y - rect.min.y) * height);
		return { sx, sy, sw, sh };
	}

	// 数组剪裁并缩放
	function arrayclipAndResize(
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
		const clippedData = new Float32Array(dw * dh);
		for (let row = 0; row < sh; row++) {
			for (let col = 0; col < sw; col++) {
				const sourceIndex = (row + sy) * bufferWidth + (col + sx);
				const destIndex = row * sw + col;
				clippedData[destIndex] = buffer[sourceIndex];
			}
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

	const piexlRect = rect2ImageBounds(bounds, decodedData.width, decodedData.height);
	// Martini需要瓦片大小为n*2+1
	const width = piexlRect.sw + 1;
	const height = piexlRect.sh + 1;
	// 瓦片剪裁并缩放
	const dem = arrayclipAndResize(
		decodedData.dem,
		decodedData.width,
		piexlRect.sx,
		piexlRect.sy,
		piexlRect.sw,
		piexlRect.sh,
		width,
		height,
	);
	return { dem, width, height };
}
