/**
 *@description: TIF DEM terrain loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { BufferGeometry, FileLoader, ImageLoader } from "three";

import { TileGeometry } from "../../geometry";
import { ITileGeometryLoader, LoaderFactory, TileSourceLoadParamsType } from "../../loader";
import { TifDemSource } from "./TifDEMSource";
import GeoTIFF, { fromArrayBuffer } from "geotiff";

/**
 * TIF DEM terrain loader
 */
export class TifDEMLoder implements ITileGeometryLoader {
	public readonly info = {
		version: "0.10.0",
		description: "TIF DEM terrain loader. It can load single tif dem.",
	};

	public readonly dataType: string = "tif-dem";

	// private _image?: HTMLImageElement | undefined;

	private _loader = new FileLoader(LoaderFactory.manager);

	public constructor() {
		this._loader.setResponseType("arraybuffer");
	}

	/**
	 * 加载材质
	 * @param source 数据源
	 * @param tile 瓦片
	 * @returns 材质
	 */
	public async load(params: TileSourceLoadParamsType<TifDemSource>): Promise<BufferGeometry> {
		const { source, bounds, z, lonLatBounds } = params;

		const geometry = new TileGeometry();

		const url = source._getUrl(0, 0, 0);

		// 请求的瓦片不在数据源范围内或没有url，直接返回材质
		if (z < source.minLevel || z > source.maxLevel || !url) {
			return geometry;
		}

		// const image = source.image; // .userData.image;

		// 如果图片已加载，则设置纹理后返回材质
		if (source.data) {
			geometry.setData(source.data);
			return geometry;
		}

		console.log("loadi image...", url);

		// 加载纹理
		const buffer = (await this._loader.loadAsync(url)) as ArrayBuffer;
		const tiff = await fromArrayBuffer(buffer);

		const image = await tiff.getImage();
		const dem = await image.readRasters({
			bbox: lonLatBounds,
			width: 64,
			height: 64,
		});

		let kmdem = dem[0];
		console.log(dem);
		kmdem = kmdem.map((h) => h / 300);
		source.data = kmdem;

		geometry.setData(source.data);
		return geometry;
	}

	private getDEM() {}
}
