/**
 *@description: ArcGis-lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { BufferGeometry, FileLoader } from "three";
import { GeometryDataType, TileGeometry } from "../../geometry";
import { LoaderFactory, LoadParamsType, PromiseWorker, TileGeometryLoader } from "../../loader";

import * as Lerc from "./lercDecode/LercDecode.es";
import decodeUrl from "./lercDecode/lerc-wasm.wasm?url";
import { parse } from "./parse";
import ParseWorker from "./parse.Worker?worker&inline";

/**
 * ArcGis-lerc格式瓦片几何体加载器
 * @link https://github.com/Esri/lerc
 */
export class TileGeometryLercLoader extends TileGeometryLoader {
	public readonly dataType = "lerc";
	public discription = "Tile LERC terrain loader. It can load ArcGis-lerc format terrain data.";
	// 图像加载器
	private fileLoader = new FileLoader(LoaderFactory.manager);

	// private worker = new ParseWorker();

	public constructor() {
		super();
		this.fileLoader.setResponseType("arraybuffer");
	}

	/**
	 * 解码给定缓冲区中的Lerc数据
	 *
	 * @param buffer Lerc编码数据的ArrayBuffer
	 * @returns 解码后的高度图数据、宽度和高度的对象
	 */
	private async decode(buffer: ArrayBuffer) {
		const { height, width, pixels } = Lerc.decode(buffer);
		const demArray = new Float32Array(height * width);
		for (let i = 0; i < demArray.length; i++) {
			demArray[i] = pixels[0][i] / 1000;
		}
		return { demArray, width, height };
	}

	/**
	 * 异步加载并解析数据，返回BufferGeometry对象
	 *
	 * @param url 数据文件的URL
	 * @param params 解析参数，包含瓦片xyz和裁剪边界clipBounds
	 * @returns 返回解析后的BufferGeometry对象
	 */
	protected async doLoad(url: string, params: LoadParamsType): Promise<BufferGeometry> {
		// 加载 LERC wasm
		await Lerc.load({
			locateFile: () => decodeUrl,
		});
		console.assert(Lerc.isLoaded());
		// 下载数据
		const buffer: ArrayBuffer = (await this.fileLoader.loadAsync(url)) as ArrayBuffer;
		// 解码数据
		const decodedData = await this.decode(buffer);
		// 取得瓦片层级和剪裁范围
		const { z, clipBounds } = params;
		// 瓦片几何体数据
		let geoData: GeometryDataType;
		if (this.useWorker) {
			const worker = new PromiseWorker(() => new ParseWorker());
			// 解析取得几何体数据
			geoData = await worker.run({ demData: decodedData, z, clipBounds }, [decodedData.demArray.buffer]);
		} else {
			// 解析取得几何体数据
			geoData = parse(decodedData, z, clipBounds);
		}
		// 创建瓦片几何体对象
		const geometry = new TileGeometry();
		// 设置瓦片几何体数据
		geometry.setData(geoData);
		return geometry;
	}
}
