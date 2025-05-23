/**
 * @file geojson-loader.ts
 * @description three-tile 之 GeoJSON加载器插件，本加载器利用 geojson-vt 库将 GeoJSON 根据瓦片坐标进行裁剪，绘制Canvas生成瓦片纹理。
 * @author 郭江峰
 * @date 2025-03-15
 */
//@ts-ignore
import geojsonvt from "geojson-vt";
import { CanvasTexture, FileLoader, Texture } from "three";
import {
	LoaderFactory,
	TileMaterialLoader,
	TileSourceLoadParamsType,
	VectorFeature,
	VectorFeatureTypes,
	VectorStyle,
	VectorTileRender,
} from "three-tile";

/** GeoJSON 加载器 */
export class GeoJSONLoader extends TileMaterialLoader {
	// 加载器信息
	public info = {
		version: "0.11.0",
		author: "GuoJF",
		description: "GeoJSON 加载器",
	};

	/** 数据类型标识 */
	public readonly dataType = "geojson";

	/** 文件加载器 */
	private _loader = new FileLoader(LoaderFactory.manager);
	/** 瓦片渲染器 */
	private _render = new VectorTileRender();

	/**
	 * 构造函数
	 */
	constructor() {
		super();
		this._loader.setResponseType("json");
	}

	/**
	 * 异步加载瓦片纹理,该方法在瓦片创建后被调用
	 *
	 * @param url GeoJSON的URL地址
	 * @param params 加载参数，包括数据源、瓦片坐标等
	 * @returns 瓦片纹理
	 */
	protected async doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture> {
		const { x, y, z, source } = params;

		const style = ("style" in source ? source.style : source.style) as VectorStyle;
		// 判断数据是否加载完成，如果已完成则直接绘制瓦片纹理
		if (source.gv) {
			return this._getTileTexture(source.gv, x, y, z, style);
		}

		// 判断是否正在加载数据，如果不是则加载数据并绘制瓦片纹理
		if (!source.loading) {
			source.loading = true;
			source.gv = await this.loadJSON(url);
			source.loading = false;
		}

		// 等待数据加载完成
		await (async (): Promise<void> => {
			while (!source.gv) {
				await new Promise(resolve => setTimeout(resolve, 100)); // 每100毫秒检查一次
			}
		})();

		console.assert(source.gv);

		// 加载完成后绘制瓦片纹理
		return this._getTileTexture(source.gv, x, y, z, style);
	}

	/**
	 * 异步加载 JSON 文件，创建 geojson-vt 实例返回。
	 *
	 * @param url JSON 文件的 URL 地址
	 * @returns 返回 geojsonvt 实例
	 */
	protected async loadJSON(url: string) {
		console.log("load geoJSON", url);
		const json = (await this._loader.loadAsync(url)) as any;
		const gv = geojsonvt(json, {
			tolerance: 2,
			// buffer: 10,
			extent: 256,
			maxZoom: 20,
			indexMaxZoom: 4,
		});
		return gv;
	}

	private drawTile(tile: geojsonvt.Tile, style?: VectorStyle) {
		const width = 256;
		const height = 256;
		const canvas = new OffscreenCanvas(width, height);
		const ctx = canvas.getContext("2d");
		if (ctx) {
			// 翻转画布
			ctx.scale(1, -1);
			ctx.translate(0, -height);
			ctx.save();
			const features = tile.features;
			for (let i = 0; i < features.length; i++) {
				this._renderFeature(ctx, features[i], style);
			}
			ctx.restore();
		}
		return canvas.transferToImageBitmap();
	}

	// 渲染单个要素
	private _renderFeature(ctx: OffscreenCanvasRenderingContext2D, feature: geojsonvt.Feature, style: VectorStyle = {}) {
		const type = [
			VectorFeatureTypes.Unknown,
			VectorFeatureTypes.Point,
			VectorFeatureTypes.Linestring,
			VectorFeatureTypes.Polygon,
		][feature.type];

		const renderFeature: VectorFeature = {
			geometry: [],
			properties: {},
		};

		for (let i = 0; i < feature.geometry.length; i++) {
			let points;
			if (!Array.isArray(feature.geometry[i][0])) {
				points = [{ x: feature.geometry[i][0], y: feature.geometry[i][1] }];
			} else {
				points = feature.geometry[i].map((p: any) => {
					return { x: p[0], y: p[1] };
				});
			}
			renderFeature.geometry.push(points);
		}
		renderFeature.properties = feature.tags;

		this._render.render(ctx, type, renderFeature, style);
	}

	/**
	 * 根据给定的坐标和样式绘制瓦片纹理
	 *
	 * @param gv 地图视图对象
	 * @param x 瓦片的 x 坐标
	 * @param y 瓦片的 y 坐标
	 * @param z 瓦片的层级
	 * @param style 可选的 GeoJSON 样式类型
	 * @returns 返回瓦片的纹理对象，如果瓦片不存在则返回空纹理对象
	 */
	private _getTileTexture(gv: any, x: number, y: number, z: number, style: VectorStyle) {
		// if (z < (style.minLevel ?? 1) || z > (style.maxLevel ?? 20)) {
		//     return new Texture();
		// }
		// 读取xyz坐标的瓦片数据
		const tile = gv.getTile(z, x, y);
		// 读取失败或不显示返回空纹理
		if (!tile) {
			return new Texture(new Image());
		}
		// 绘制瓦片
		const img = this.drawTile(tile, style);
		// 创建纹理对象并返回
		return new CanvasTexture(img);
	}
}
