/**
 *@description: ArcGis-lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FileLoader } from "three";
import { GeometryDataType } from "../../geometry";
import { LoaderFactory, TileGeometryLoader } from "../../loader";

import * as Lerc from "./lercDecode/LercDecode.es";
import decodeUrl from "./lercDecode/lerc-wasm.wasm?url";
import { DEMType, parse } from "./parse";
import ParseWorker from "./parse.Worker?worker&inline";

/**
 * ArcGis-lerc格式瓦片几何体加载器
 * @link https://github.com/Esri/lerc
 */
export class TileGeometryLercLoader extends TileGeometryLoader<DEMType> {
	public readonly dataType = "lerc";
	public discription = "Tile LERC terrain loader. It can load ArcGis-lerc format terrain data.";
	// 图像加载器
	private fileLoader = new FileLoader(LoaderFactory.manager);

	public constructor() {
		super();
		this.fileLoader.setResponseType("arraybuffer");
	}

	private async decode(buffer: ArrayBuffer) {
		const { height, width, pixels } = Lerc.decode(buffer);
		const demArray = new Float32Array(height * width);
		for (let i = 0; i < demArray.length; i++) {
			demArray[i] = pixels[0][i] / 1000;
		}
		return { demArray, width, height };
	}

	protected async doLoad(url: string): Promise<DEMType> {
		// 加载 LERC 格式数据解析wasm
		await Lerc.load({
			locateFile: () => decodeUrl,
		});
		console.assert(Lerc.isLoaded());
		const buffer: ArrayBuffer = (await this.fileLoader.loadAsync(url)) as ArrayBuffer;
		const decodedData = await this.decode(buffer);
		return decodedData;
	}

	protected async doPrase(
		demData: DEMType,
		_x: number,
		_y: number,
		z: number,
		clipBounds: [number, number, number, number],
	): Promise<GeometryDataType | Float32Array> {
		if (this.useWorker) {
			const worker = new ParseWorker();
			return new Promise((resolve) => {
				worker.onmessage = (e: MessageEvent<GeometryDataType>) => {
					resolve(e.data);
				};
				worker.postMessage({ demData, z, clipBounds }, [demData.demArray.buffer]);
			});
		} else {
			const geoInfo = parse(demData, z, clipBounds);
			return geoInfo;
		}
	}
}
