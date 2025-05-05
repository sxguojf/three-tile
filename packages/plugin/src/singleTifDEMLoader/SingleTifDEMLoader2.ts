/**
 *@description: TIF DEM terrain loader
 *@author: chaoxl
 *@date: 2023-04-05
 */

import { BufferGeometry, FileLoader, MathUtils } from "three";

import { fromArrayBuffer } from "geotiff";
import { ITileGeometryLoader, LoaderFactory, TileGeometry, TileSourceLoadParamsType } from "three-tile";
import { SingleTifDEMSource } from "./SingleTifDEMSource1";
import { DEMType, parse } from "./parse";

/**
 * TIF DEM terrain loader 单张TIF图地形加载器
 */
export class SingleTifDEMLoader implements ITileGeometryLoader {
	public readonly info = {
		author: "chaoxl",
		version: "0.10.0",
		description: "TIF DEM terrain loader. It can load single tif dem.",
	};

	// 数据标识
	public readonly dataType: string = "single-tif";

	// 数据加载器
	private _loader = new FileLoader(LoaderFactory.manager);

	/**
	 * 构造函数，初始化 TifDEMLoder 实例
	 */
	public constructor() {
		// 设置文件加载器的响应类型为 ArrayBuffer
		this._loader.setResponseType("arraybuffer");
	}

	/**
	 * 加载瓦片的几何体数据
	 * @param params 包含加载瓦片所需的参数，类型为 TileSourceLoadParamsType<TifDemSource>
	 * @returns 加载完成后返回一个 BufferGeometry 对象
	 */
	public async load(params: TileSourceLoadParamsType<SingleTifDEMSource>): Promise<BufferGeometry> {
		// 从 params 中解构出数据源、瓦片层级、经纬度边界和投影边界
		const { source, z, bounds } = params;
		// 创建一个新的 TileGeometry 实例，用于存储瓦片的几何体数据
		const geometry = new TileGeometry();
		// 获取 TIF 文件的 URL
		const url = source._getUrl(0, 0, 0);
		// 请求的瓦片不在数据源范围内或没有url，直接返回几何体
		if (z < source.minLevel || z > source.maxLevel || !url) {
			return geometry;
		}

		// 抽稀像素点，根据瓦片层级计算目标像素大小，并使用 MathUtils.clamp 方法将其限制在 2 到 128 之间
		const targetSize = MathUtils.clamp((params.z + 2) * 3, 2, 128);

		// 如果数据未加载，加载数据
		if (!source._data) {
			// 打印加载信息
			console.log("load image...", url);
			// 加载tif文件，使用 _loader.loadAsync 方法异步加载 TIF 文件，并将结果转换为 ArrayBuffer 类型
			const buffer = (await this._loader.loadAsync(url)) as ArrayBuffer;
			// 调用 getTIFFRaster 方法将 ArrayBuffer 解析为包含栅格数据的对象，并将其存储在 source.data 中
			source._data = await this.getTIFFRaster(buffer);
		}
		// 调用 getTileDEM 方法获取指定瓦片的 DEM 数据
		const dem = parse(source._data, source._projectionBounds, bounds, targetSize, targetSize);

		// 将获取到的 DEM 数据设置到 geometry 中，并返回 geometry\
		return geometry.setData(dem, source.skirtHeight);
	}

	/**
	 * 从 ArrayBuffer 中读取 TIFF 图像的栅格数据
	 * @param buffer 包含 TIFF 图像数据的 ArrayBuffer
	 * @returns 包含栅格数据的对象，包含 buffer、width 和 height 属性
	 */
	private async getTIFFRaster(buffer: ArrayBuffer): Promise<DEMType> {
		// 从 ArrayBuffer 中解析出 GeoTIFF 对象
		const tiff = await fromArrayBuffer(buffer);
		// 获取 GeoTIFF 中的第一个图像，并读取其栅格数据
		const rasters = await (await tiff.getImage(0)).readRasters();
		// 返回包含栅格数据的对象
		return {
			// 第一个波段的栅格数据，强制转换为 Float32Array 类型
			buffer: rasters[0] as Float32Array,
			// 栅格数据的宽度
			width: rasters.width,
			// 栅格数据的高度
			height: rasters.height,
		};
	}
}
