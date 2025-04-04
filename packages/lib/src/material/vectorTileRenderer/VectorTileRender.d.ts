/**
 *@description: Vectior tile renderer class
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { VectorFeatureTypes, VectorFeature, VectorStyle } from "./IVectorTileRender";
/**
 * 矢量数据渲染器
 */
export declare class VectorTileRender {
    /**
     * 渲染矢量数据
     * @param ctx 渲染上下文
     * @param type 元素类型
     * @param feature 元素
     * @param style 样式
     * @param scale 拉伸倍数
     */
    render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, type: VectorFeatureTypes, feature: VectorFeature, style: VectorStyle, scale?: number): void;
    private _renderPointText;
    private _renderLineString;
    private _renderPolygon;
}
