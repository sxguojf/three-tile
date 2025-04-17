/**
 *@description: ArcGis-lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FileLoader } from "three";
import { WorkerPool } from "three/examples/jsm/utils/WorkerPool.js";
import { TileGeometry } from "../../geometry/TileGeometry";
import { LoaderFactory, TileGeometryLoader, TileSourceLoadParamsType } from "../../loader";
// import decoder from "./lerc-wasm.wasm?url";
// import * as Lerc from "./LercDecode.es";

import ParseWorker from "./parse.Worker?worker&inline";
import { parse } from "./parse";

const THREADSNUM = 10;

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
		this.fileLoader.setResponseType("arraybuffer");
		this._workerPool.setWorkerCreator(() => new ParseWorker());
	}

	/**
	 * 异步加载并解析数据，返回BufferGeometry对象
	 *
	 * @param url 数据文件的URL
	 * @param params 解析参数，包含瓦片xyz和裁剪边界clipBounds
	 * @returns 返回解析后的BufferGeometry对象
	 */
	protected async doLoad(url: string, params: TileSourceLoadParamsType): Promise<TileGeometry> {
		if (this._workerPool.pool === 0) {
			this._workerPool.setWorkerLimit(THREADSNUM);
		}

		// 取得瓦片层级和剪裁范围
		const { z, bounds } = params;
		const buffer = (await this.fileLoader.loadAsync(url).catch(() => {
			return new Float32Array(256 * 256);
		})) as ArrayBuffer;

		// 解析取得几何体数据
		// const message = {
		// 	demData: buffer,
		// 	z,
		// 	clipBounds: bounds,
		// };
		// // const transferList = [buffer];
		// const geoData = (await this._workerPool.postMessage(message)).data;
		const geoData = parse(buffer, z, bounds);

		// 创建瓦片几何体对象
		return new TileGeometry().setData(geoData);
	}
}
