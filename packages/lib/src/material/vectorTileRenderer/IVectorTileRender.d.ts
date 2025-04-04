/**
 *@description: Vectior tile renderer interface
 *@author: 郭江峰
 *@date: 2023-04-05
 */
/**
 *  瓦片绘图样式，参考leaflet的path样式定义
 */
export interface VectorStyle {
    minLevel?: number;
    maxLevel?: number;
    stroke?: boolean | undefined;
    color?: string | undefined;
    weight?: number | undefined;
    opacity?: number | undefined;
    dashArray?: number[] | undefined;
    dashOffset?: string | undefined;
    fill?: boolean | undefined;
    fillColor?: string | undefined;
    font?: string;
    fontColor?: string;
    fontOffset?: [number, number];
    textField?: string;
    fillOpacity?: number | undefined;
    fillRule?: CanvasFillRule | undefined;
    shadowBlur?: number;
    shadowColor?: string;
    shadowOffset?: [number, number];
}
/**
 * 样式集合
 */
export type VectorStyles = {
    [key: string]: VectorStyle;
};
/**
 * 元素类型
 */
export declare enum VectorFeatureTypes {
    Unknown = 0,
    Point = 1,
    Linestring = 2,
    Polygon = 3
}
/**
 * 点类型
 */
export type Point = {
    x: number;
    y: number;
};
/**
 * 矢量特征值
 */
export type VectorFeature = {
    geometry: Point[][];
    properties?: Record<string, unknown>;
    size?: number;
};
