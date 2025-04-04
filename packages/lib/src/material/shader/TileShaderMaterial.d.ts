/**
 *@description: tile material, not used. Multiple textures are currently used instead.
 *@author: 郭江峰
 *@date: 2023-04-06
 */
/**
 * 瓦片材质（废弃）
 *
 * TileMaterial使用自定义着色器实现地图材质
 * 1、使用自定义着色器根据影像图数据实现多个瓦片纹理的混合
 *    因着色器中难以传入动态属性，也就是影像瓦片层数不能运行时修改，只能预设固定层数，故放弃
 * 2、使用Canvas根据影像图数据实现多个瓦片纹理的混合
 *    Canvas绘制效率相对更灵活，可以随心所欲绘制纹理，但理论上效率略低（肉测无影响），故放弃
 * 3、使用自定义着色器根据高程数据拉伸Z坐标实现高度
 *    用着色器实现地形渲染效率非常高，但不好解决瓦片接缝问题，另外射线法取高程也无法实现，故放弃
 *
 * 目前瓦片材质直接使用了MeshLambertMaterial，影像叠加按使用多重纹理实现。
 *
 */
import { Color, ShaderMaterial, Texture } from "three";
export interface TileMaterialParameters {
    map?: Texture | null | undefined;
    map1?: Texture | null | undefined;
    transparent?: boolean;
    wireframe?: boolean;
    diffuse?: Color;
}
/**
 * Tile shade, include multiple textures and pixel to Z
 */
export declare class TileShaderMaterial extends ShaderMaterial {
    constructor(parameters: TileMaterialParameters);
    dispose(): void;
    defineProperty(propertyName: string): void;
}
