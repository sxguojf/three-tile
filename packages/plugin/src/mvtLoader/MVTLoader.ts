import { VectorTile, VectorTileFeature, VectorTileLayer } from "@mapbox/vector-tile";
import Pbf from "pbf";
import { CanvasTexture, FileLoader, Texture } from "three";
import {
	LoaderFactory,
	TileLoadClipParamsType,
	TileMaterialLoader,
	TileSourceLoadParamsType,
	VectorFeature,
	VectorFeatureTypes,
	VectorStyle,
	VectorTileRender,
	version,
} from "three-tile";
import { MVTSource } from "./MVTSource";

export type StyleType = { layer: VectorStyle[] };

export class MVTLoader extends TileMaterialLoader {
	public dataType: string = "mvt";
	// 加载器信息
	public info = {
		version,
		author: "GuoJF",
		description: "MVT瓦片加载器",
	};

	private _loader = new FileLoader(LoaderFactory.manager);
	private _render = new VectorTileRender();

	public constructor() {
		super();
		this._loader.setResponseType("arraybuffer");
	}

	protected async doLoad(url: string, params: TileLoadClipParamsType<MVTSource>): Promise<Texture> {
		// 加载矢量瓦片数据
		const data = (await this._loader.loadAsync(url)) as ArrayBuffer;
		// 解析矢量瓦片
		const vectorTile = new VectorTile(new Pbf(data));
		// 绘制矢量瓦片
		const img = this.drawTile(vectorTile, params.source.style, params.z);
		// 生成瓦片纹理
		return new CanvasTexture(img);
	}

	/**
	 * 在离屏画布上绘制矢量瓦片
	 *
	 * @param vectorTile 待绘制的矢量瓦片对象
	 * @returns 绘制完成的图像位图
	 * @throws 如果画布上下文不可用，则抛出错误
	 */
	private drawTile(vectorTile: VectorTile, style: StyleType, z: number): ImageBitmap {
		const width = 256;
		const height = 256;
		const canvas = new OffscreenCanvas(width, height);
		const ctx = canvas.getContext("2d");
		if (ctx) {
			// 翻转画布
			ctx.scale(1, -1);
			ctx.translate(0, -height);
			if (style) {
				// 有style时，遍历styles绘制
				for (const layerName in style.layer) {
					const layerStyle = style.layer[layerName];
					if (style && (z < (layerStyle.minLevel ?? 1) || z > (layerStyle.maxLevel ?? 20))) {
						continue;
					}
					const layer = vectorTile.layers[layerName];
					if (layer) {
						const scale = width / layer.extent;
						this._renderLayer(ctx, layer, layerStyle, scale);
					}
				}
			} else {
				// 无style时，遍历矢量瓦片图层使用默认style绘制
				for (const layerName in vectorTile.layers) {
					const layer = vectorTile.layers[layerName];
					const scale = width / layer.extent;
					this._renderLayer(ctx, layer, undefined, scale);
				}
			}

			return ctx.canvas.transferToImageBitmap();
		} else {
			throw new Error("Canvas context is not available");
		}
	}

	private _renderLayer(
		ctx: OffscreenCanvasRenderingContext2D,
		layer: VectorTileLayer,
		style?: VectorStyle,
		scale: number = 1
	) {
		ctx.save();
		for (let i = 0; i < layer.length; i++) {
			const feature = layer.feature(i);
			this._renderFeature(ctx, feature, style, scale);
		}
		ctx.restore();
		return this;
	}

	// 渲染单个要素
	private _renderFeature(
		ctx: OffscreenCanvasRenderingContext2D,
		feature: VectorTileFeature,
		style: VectorStyle = {},
		scale: number = 1
	) {
		const type = [
			VectorFeatureTypes.Unknown,
			VectorFeatureTypes.Point,
			VectorFeatureTypes.Linestring,
			VectorFeatureTypes.Polygon,
		][feature.type];
		const renderFeature: VectorFeature = {
			geometry: feature.loadGeometry(),
			properties: feature.properties,
		};

		this._render.render(ctx, type, renderFeature, style, scale);
	}
}
