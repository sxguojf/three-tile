/** 瓦片绘图样式，参考leaflet的path样式定义 */
export interface VectorStyle {
    minLevel?: number;
    maxLevel?: number;
    // 绘制线条与否
    stroke?: boolean | undefined;
    // 线条颜色
    color?: string | undefined;
    // 线条宽度
    weight?: number | undefined;
    // 线条透明度
    opacity?: number | undefined;
    // 线条样式，参考https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray
    dashArray?: number[] | undefined;
    // 线条偏移量，参考https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset
    dashOffset?: string | undefined;
    // 是否填充区域
    fill?: boolean | undefined;
    // 填充颜色
    fillColor?: string | undefined;
    // 文本样式，参考https://developer.mozilla.org/docs/Web/CSS/font
    font?: string;
    // 文本颜色
    fontColor?: string;
    // 文本偏移量，相对于左上角的位置 [x, y]
    fontOffset?: [number, number];
    // 文本字段，默认为properties.name
    textField?: string;
    // 填充透明度
    fillOpacity?: number | undefined;
    // 填充规则，参考https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule
    fillRule?: CanvasFillRule | undefined;
    // 发光模糊程度
    shadowBlur?: number;
    // 发光颜色
    shadowColor?: string;
    // 发光偏移量
    shadowOffset?: [number, number];
}

export type VectorStyles = { [key: string]: VectorStyle };

export enum VectorFeatureTypes {
    Unknown = 0,
    Point = 1,
    Linestring = 2,
    Polygon = 3,
}
export type Point = { x: number; y: number };

export type VectorFeature = {
    geometry: Point[][];
    properties?: Record<string, any>;
    size?: number;
};
