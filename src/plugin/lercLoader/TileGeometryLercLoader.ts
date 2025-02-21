import { Box2, MathUtils } from "three";

import {
	FileLoaderEx,
	ITileGeometryLoader,
	LoaderFactory,
	getSafeTileUrlAndBounds,
	rect2ImageBounds,
} from "../../loader";

import { GeometryDataType, TileGeometry } from "../../geometry";
import { ISource } from "../../source";
import * as Lerc from "./lercDecode/LercDecode.es";
import { ArrayclipAndResize, parse } from "./parse";
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
		// 计算瓦片图片大小（像素）
		const targetSize = MathUtils.clamp((z + 2) * 3, 2, 64);
		// 加载瓦片
		return this._load(url, geometry, targetSize, bounds, onLoad, abortSignal);
	}

	private async decode(buffer: ArrayBuffer) {
		if (!Lerc.isLoaded()) {
			await Lerc.load({
				locateFile: (wasmFileName?: string | undefined, _scriptDir?: string | undefined) => `./${wasmFileName}`,
			});
		}

		const pixelBlock = Lerc.decode(buffer);
		const { height, width, pixels } = pixelBlock;
		const dem = new Float32Array(height * width);
		for (let i = 0; i < dem.length; i++) {
			dem[i] = pixels[0][i] / 1000;
		}
		return { width, height, dem };
	}

	private _load(
		url: string,
		geometry: TileGeometry,
		targetSize: number,
		bounds: Box2,
		onLoad: () => void,
		abortSignal: AbortSignal,
	) {
		this.fileLoader.load(
			url,
			// onLoad
			(buffer) => {
				this.decode(buffer).then((decodedData: { dem: Float32Array; width: number }) => {
					// 计算剪裁区域
					const piexlRect = rect2ImageBounds(bounds, decodedData.width);
					// 剪裁一部分，缩放到targetSize大小
					const data = ArrayclipAndResize(
						decodedData.dem,
						decodedData.width,
						piexlRect.sx,
						piexlRect.sy,
						piexlRect.sw,
						piexlRect.sh,
						targetSize,
						targetSize,
					);

					// 是否使用worker解析
					if (this.useWorker) {
						const worker = new ParseWorker();
						worker.onmessage = (e: MessageEvent<GeometryDataType>) => {
							geometry.setData(e.data);
							onLoad();
						};
						worker.postMessage({ buffer: data });
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
