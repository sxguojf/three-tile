/**
 *@description: ArcGis-lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FileLoaderEx, LoaderFactory, TileGeometryLoader } from "../../loader";
import { GeometryDataType } from "../../geometry";

import * as Lerc from "./lercDecode/LercDecode.es";
import { DEMType, parse } from "./parse";
import ParseWorker from "./parse.Worker?worker&inline";
import decodeUrl from "./lercDecode/lerc-wasm.wasm?url";

/**
 * ArcGis-lerc格式瓦片几何体加载器
 * @link https://github.com/Esri/lerc
 */
export class TileGeometryLercLoader extends TileGeometryLoader<DEMType> {
	public readonly dataType = "lerc";
	public discription = "Tile LERC terrain loader. It can load ArcGis-lerc format terrain data.";
	// 图像加载器
	private fileLoader = new FileLoaderEx(LoaderFactory.manager);

	public constructor() {
		super();
		this.fileLoader.setResponseType("arraybuffer");
	}

	private async decode(buffer: ArrayBuffer) {
		if (!Lerc.isLoaded()) {
			await Lerc.load({
				locateFile: () => decodeUrl,
			});
			// await Lerc.load();
		}
		const { height, width, pixels } = Lerc.decode(buffer);
		const demArray = new Float32Array(height * width);
		for (let i = 0; i < demArray.length; i++) {
			demArray[i] = pixels[0][i] / 1000;
		}
		return { demArray, width, height };
	}

	protected doLoad(
		url: string,
		onLoad: (buffer: DEMType) => void,
		onError: (event: ErrorEvent | Event | DOMException) => void,
		abortSignal: AbortSignal,
	): void {
		this.fileLoader.load(
			url,
			async (buffer) => {
				// 解码lerc数据，wasm无法放入worker
				const decodedData = await this.decode(buffer);
				onLoad(decodedData);
			},
			undefined,
			onError,
			abortSignal,
		);
	}

	protected doPrase(
		demData: DEMType,
		_x: number,
		_y: number,
		z: number,
		clipBounds: [number, number, number, number],
		onParse: (GeometryData: GeometryDataType | Float32Array, dem?: Uint8Array) => void,
	): void {
		if (this.useWorker) {
			const worker = new ParseWorker();
			worker.onmessage = (e: MessageEvent<Float32Array>) => {
				onParse(e.data);
			};
			worker.postMessage({ demData, z, clipBounds }, [demData.demArray.buffer]);
		} else {
			const geoInfo = parse(demData, z, clipBounds);
			onParse(geoInfo);
		}
	}
}
