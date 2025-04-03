/**
 *@description: Vectior tile renderer class
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { VectorFeatureTypes, VectorFeature, VectorStyle } from "./IVectorTileRender";

/**
 * 矢量数据渲染器
 */
export class VectorTileRender {
	/**
	 * 渲染矢量数据
	 * @param ctx 渲染上下文
	 * @param type 元素类型
	 * @param feature 元素
	 * @param style 样式
	 * @param scale 拉伸倍数
	 */
	public render(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		type: VectorFeatureTypes,
		feature: VectorFeature,
		style: VectorStyle,
		scale: number = 1,
	): void {
		ctx.lineCap = "round";
		ctx.lineJoin = "round";

		// 设置阴影效果
		if ((style.shadowBlur ?? 0) > 0) {
			ctx.shadowBlur = style.shadowBlur ?? 2;
			ctx.shadowColor = style.shadowColor ?? "black";
			ctx.shadowOffsetX = style.shadowOffset ? style.shadowOffset[0] : 0;
			ctx.shadowOffsetY = style.shadowOffset ? style.shadowOffset[1] : 0;
		}

		// 根据要素类型渲染
		switch (type) {
			case VectorFeatureTypes.Point:
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.font = style.font ?? "14px Arial";
				ctx.fillStyle = style.fontColor ?? "white";
				this._renderPointText(ctx, feature, scale, style.textField ?? "name", style.fontOffset ?? [0, -8]);
				break;
			case VectorFeatureTypes.Linestring:
				this._renderLineString(ctx, feature, scale);
				break;
			case VectorFeatureTypes.Polygon:
				this._renderPolygon(ctx, feature, scale);
				break;
			default:
				console.warn(`Unknown feature type: ${type}`);
		}

		// 渲染填充区域
		if (style.fill || type === VectorFeatureTypes.Point) {
			ctx.globalAlpha = style.fillOpacity || 0.5;
			ctx.fillStyle = style.fillColor || style.color || "#3388ff";
			ctx.fill(style.fillRule || "evenodd");
		}

		// 渲染线条
		if ((style.stroke ?? true) && (style.weight ?? 1) > 0) {
			ctx.globalAlpha = style.opacity || 1;
			ctx.lineWidth = style.weight || 1;
			ctx.strokeStyle = style.color || "#3388ff";
			ctx.setLineDash(style.dashArray || []);
			ctx.stroke();
		}
	}

	// 渲染点要素
	private _renderPointText(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		feature: VectorFeature,
		scale: number = 1,
		textFiled: string = "name",
		fontOffset: [number, number] = [0, 0],
	) {
		const points = feature.geometry;
		ctx.beginPath();
		for (const point of points) {
			for (let i = 0; i < point.length; i++) {
				const p = point[i];
				ctx.arc(p.x * scale, p.y * scale, 2, 0, 2 * Math.PI);
			}
		}
		const properties = feature.properties;
		// if (properties && properties.name && (properties.rank as number) < 12 && (properties.rank as number) > 5) {
		if (properties && properties[textFiled]) {
			ctx.fillText(
				properties[textFiled] as string,
				points[0][0].x * scale + fontOffset[0],
				points[0][0].y * scale + fontOffset[1],
			);
		}
	}

	// 渲染线要素
	private _renderLineString(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		feature: VectorFeature,
		scale: number,
	) {
		const lines = feature.geometry;

		ctx.beginPath();
		for (const line of lines) {
			for (let i = 0; i < line.length; i++) {
				const { x, y } = line[i];
				if (i === 0) {
					ctx.moveTo(x * scale, y * scale);
				} else {
					ctx.lineTo(x * scale, y * scale);
				}
			}
		}
	}

	// 渲染面要素
	private _renderPolygon(
		ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
		feature: VectorFeature,
		scale: number,
	) {
		const polygons = feature.geometry;

		ctx.beginPath();
		for (let i = 0; i < polygons.length; i++) {
			const ring = polygons[i];
			for (let j = 0; j < ring.length; j++) {
				const { x, y } = ring[j];
				if (j === 0) {
					ctx.moveTo(x * scale, y * scale);
				} else {
					ctx.lineTo(x * scale, y * scale);
				}
			}
			ctx.closePath();
		}
	}
}
