/**
 *@description: TIF DEM terrain loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { BufferGeometry, FileLoader } from "three";

import { fromArrayBuffer, GeoTIFFImage } from "geotiff";
import { TileGeometry } from "../../geometry";
import { ITileGeometryLoader, LoaderFactory, TileSourceLoadParamsType } from "../../loader";
import { TifDemSource } from "./TifDEMSource";
import { parse } from "./parse";

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
		const { source, z, lonLatBounds, bounds } = params;
		const geometry = new TileGeometry();
		const url = source._getUrl(0, 0, 0);
		// 请求的瓦片不在数据源范围内或没有url，直接返回材质
		if (z < source.minLevel || z > source.maxLevel || !url || !lonLatBounds) {
			return geometry;
		}

		// 如果图片已加载，则设置纹理后返回材质
		if (source.data && lonLatBounds) {
			const dem = await this.getTileDEM(source.data, source._projectionBounds, bounds);
			return geometry.setData(dem);
		}

		console.log("loadi image...", url);

		// 加载DEM
		const buffer = (await this._loader.loadAsync(url)) as ArrayBuffer;
		// 解析
		const image = await this.getTIFF(buffer);
		source.data = image;

		const tileDEM = await this.getTileDEM(image, source._projectionBounds, bounds);
		return geometry.setData(tileDEM);
	}

	private async getTIFF(buffer: ArrayBuffer) {
		const tiff = await fromArrayBuffer(buffer);
		const image = await tiff.getImage();
		// console.log("geotiff", image.getBoundingBox());
		// console.log(image.getGeoKeys());
		return image;
	}

	private async getTileDEM(
		image: GeoTIFFImage,
		sourceProjBbox: [number, number, number, number],
		tileBounds: [number, number, number, number],
	) {
		const dem = await readRastersByProjBbox(image, sourceProjBbox, tileBounds, 64, 64);
		if (dem instanceof Float32Array) {
			return dem.map((h) => h / 500);
		}
		throw new Error("DEM data is not Float32Array");
	}
}

/**
 * 根据投影坐标bbox读取数据（不检查越界）
 * @param {GeoTIFFImage} image - GeoTIFF图像对象
 * @param {Array<number>} tileProjBbox - [minX, minY, maxX, maxY] (EPSG:3857坐标)
 * @param {number} [outputWidth] - 可选：输出宽度（像素）
 * @param {number} [outputHeight] - 可选：输出高度（像素）
 */
async function readRastersByProjBbox(
	image: GeoTIFFImage,
	sourceProjBbox: [number, number, number, number],
	tileProjBbox: [number, number, number, number],
	outputWidth: number,
	outputHeight: number,
) {
	const img = await image.readRasters();
	const dem = img[0];
	const data = {
		demArray: dem as Float32Array,
		width: image.getWidth(),
		height: image.getHeight(),
	};
	return parse(data, sourceProjBbox, tileProjBbox, outputWidth, outputHeight);
}

// function flipY(data: Float32Array, width: number, height: number) {
// 	const output = new Float32Array(data.length);
// 	for (let y = 0; y < height; y++) {
// 		const sourceRow = y;
// 		const targetRow = height - 1 - y; // 计算翻转后的行位置

// 		const sourceStart = sourceRow * width;
// 		const targetStart = targetRow * width;

// 		output.set(data.subarray(sourceStart, sourceStart + width), targetStart);
// 	}
// 	return output;
// }
