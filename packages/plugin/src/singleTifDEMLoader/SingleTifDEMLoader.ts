/**
 *@description: TIF DEM terrain loader
 *@author: chaoxl
 *@date: 2023-04-05
 */

import { fromUrl } from "geotiff";
import { BufferGeometry, FileLoader, MathUtils } from "three";
//@ts-ignore
import createTile from "geotiff-tile";

import { ITileGeometryLoader, LoaderFactory, TileGeometry, TileSourceLoadParamsType } from "three-tile";
import { SingleTifDEMSource } from "./SingleTifDEMSource";

/**
 * TIF DEM terrain loader
 */
export class SingleTifDEMLoader implements ITileGeometryLoader {
	public readonly info = {
		author: "chaoxl",
		version: "0.11.2",
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
		// 从 params 中解构出数据源、瓦片层级、经纬度边界
		const { source, z, lonLatBounds } = params;
		// 创建一个新的 TileGeometry 实例，用于存储瓦片的几何体数据
		const geometry = new TileGeometry();
		// 获取 TIF 文件的 URL
		const url = source._getUrl(0, 0, 0);
		// 请求的瓦片不在数据源范围内或没有url，直接返回几何体
		if (z < source.minLevel || z > source.maxLevel || !url) {
			return geometry;
		}
		// 抽稀像素点，根据瓦片层级计算目标像素大小，并使用 MathUtils.clamp 方法将其限制在 2 到 128 之间
		const targetSize = MathUtils.clamp((params.z + 2) * 3, 2, 256);

		// 如果数据未加载，加载数据
		if (!source._data) {
			// console.log("load image...", url);
			source._data = await fromUrl(url);
		}

		// 获取 TIF 文件的无数据值
		// const no_data = (await source._data.getImage()).fileDirectory;
		// debugger;
		// 瓦片截取参数
		const tileOpts = {
			geotiff: source._data,
			bbox: lonLatBounds,
			method: "bilinear",
			tile_height: targetSize,
			tile_width: targetSize,
			// tile_no_data: no_data,
		};
		// 截取瓦片
		const { tile } = await createTile(tileOpts);
		// 设置数据
		const dem = tile[0].map((i: number) => (isNaN(i) ? null : i));
		geometry.setData(dem, source.skirtHeight);
		// geometry.setData(tile[0]);
		return geometry;
	}
}
