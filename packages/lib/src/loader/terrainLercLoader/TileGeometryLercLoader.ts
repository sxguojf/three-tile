/**
 *@description: ArcGis-lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FileLoader } from "three";
import { WorkerPool } from "three/examples/jsm/utils/WorkerPool.js";
import { LoaderFactory, TileGeometryLoader, TileLoadClipParamsType } from "..";
import { TileGeometry } from "../../geometry/TileGeometry";

import { version } from "../..";
import ParseWorker from "./parse.worker?worker&inline";

const THREADSNUM = 5;

/**
 * ArcGis-lerc格式瓦片几何体加载器
 * @link https://github.com/Esri/lerc
 */
export class TileGeometryLercLoader extends TileGeometryLoader {
	public readonly info = {
		version,
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
	protected async doLoad(url: string, params: TileLoadClipParamsType): Promise<TileGeometry> {
		if (this._workerPool.pool === 0) {
			this._workerPool.setWorkerLimit(THREADSNUM);
		}

		// 取得瓦片层级和剪裁范围
		const { z, clipBounds } = params;
		const buffer = await this.fileLoader.loadAsync(url);

		// 解析取得几何体数据
		const message = {
			demData: buffer,
			z,
			clipBounds,
		};
		// const transferList = [buffer];
		const geoData = (await this._workerPool.postMessage(message)).data;
		// const geoData = parse(buffer, z, bounds);

		// 创建瓦片几何体对象
		return new TileGeometry().setData(geoData);
	}
}
