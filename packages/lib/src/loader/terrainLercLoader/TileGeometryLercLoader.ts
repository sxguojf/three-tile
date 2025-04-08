/**
 *@description: ArcGis-lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FileLoader } from "three";
import { WorkerPool } from "three/examples/jsm/utils/WorkerPool.js";
import { TileGeometry } from "../../geometry/TileGeometry";
import { LoaderFactory, TileGeometryLoader, TileSourceLoadParamsType } from "../../loader";
// import decoder from "./lercDecode/lerc-wasm.wasm?url";
import * as Lerc from "./LercDecode.es";
import ParseWorker from "./parse.Worker?worker&inline";

const THREADSNUM = 10;
const decoder = new URL("lerc-wasm.wasm", import.meta.url).href;
Lerc.load({ locateFile: () => decoder });

/**
 * ArcGis-lerc格式瓦片几何体加载器
 * @link https://github.com/Esri/lerc
 */
export class TileGeometryLercLoader extends TileGeometryLoader {
	public readonly info = {
		version: "0.10.0",
		description: "Tile LERC terrain loader. It can load ArcGis-lerc format terrain data.",
	};

	public readonly dataType = "lerc";
	// 图像加载器
	private fileLoader = new FileLoader(LoaderFactory.manager);
	private _workerPool: WorkerPool = new WorkerPool(0);

	public constructor() {
		super();
		// Lerc.load({ locateFile: () => new URL(`./lerc-wasm.wasm`, import.meta.url).href });
		// const url = new URL(`./lercDecode/lerc-wasm.wasm`, import.meta.url).href;
		// console.log(url);
		// Lerc.load();

		this.fileLoader.setResponseType("arraybuffer");
		this._workerPool.setWorkerCreator(() => new ParseWorker());
	}

	/**
	 * 解码给定缓冲区中的Lerc数据
	 *
	 * @param buffer Lerc编码数据的ArrayBuffer
	 * @returns 解码后的高度图数据、宽度和高度的对象
	 */
	private async decode(buffer: ArrayBuffer) {
		await waitFor(Lerc.isLoaded());
		console.assert(Lerc.isLoaded());

		const { height, width, pixels } = Lerc.decode(buffer);
		const demArray = new Float32Array(height * width);
		for (let i = 0; i < demArray.length; i++) {
			demArray[i] = pixels[0][i];
		}
		return { array: demArray, width, height };
	}

	/**
	 * 异步加载并解析数据，返回BufferGeometry对象
	 *
	 * @param url 数据文件的URL
	 * @param params 解析参数，包含瓦片xyz和裁剪边界clipBounds
	 * @returns 返回解析后的BufferGeometry对象
	 */
	protected async doLoad(url: string, params: TileSourceLoadParamsType): Promise<TileGeometry> {
		// 下载数据
		const buffer: ArrayBuffer = (await this.fileLoader.loadAsync(url)) as ArrayBuffer;
		// 解码数据
		const decodedData = await this.decode(buffer);

		// 取得瓦片层级和剪裁范围
		const { z, bounds } = params;
		let geoData;

		if (this._workerPool.pool === 0) {
			this._workerPool.setWorkerLimit(THREADSNUM);
		}
		// 解析取得几何体数据
		const message = {
			demData: decodedData,
			z,
			clipBounds: bounds,
		};
		const transferList = [decodedData.array.buffer];
		geoData = (await this._workerPool.postMessage(message, transferList)).data;

		// 创建瓦片几何体对象
		return new TileGeometry().setData(geoData);
	}
}

function waitFor(condition: boolean, delay = 100) {
	return new Promise<void>(resolve => {
		const interval = setInterval(() => {
			if (condition) {
				clearInterval(interval);
				resolve();
			}
		}, delay);
	});
}
