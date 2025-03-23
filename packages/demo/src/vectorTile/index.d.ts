import { default as default_2 } from 'geojson-vt';
import { SourceOptions } from 'three-tile';
import { Texture } from 'three';
import { TileMaterialLoader } from 'three-tile';
import { TileSource } from 'three-tile';
import { TileSourceLoadParamsType } from 'three-tile';
import { VectorStyle } from 'three-tile';
import { VectorStyles } from 'three-tile';

/** GeoJSON 加载器 */
export declare class GeoJSONLoader extends TileMaterialLoader {
    info: {
        version: string;
        author: string;
        description: string;
    };
    /** 数据类型标识 */
    readonly dataType = "geojson";
    /** 文件加载器 */
    private _loader;
    /** 瓦片渲染器 */
    private _render;
    /**
     * 构造函数
     */
    constructor();
    /**
     * 异步加载瓦片纹理,该方法在瓦片创建后被调用
     *
     * @param url GeoJSON的URL地址
     * @param params 加载参数，包括数据源、瓦片坐标等
     * @returns 瓦片纹理
     */
    protected doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
    /**
     * 异步加载 JSON 文件，创建 geojson-vt 实例返回。
     *
     * @param url JSON 文件的 URL 地址
     * @returns 返回 geojsonvt 实例
     */
    protected loadJSON(url: string): Promise<{
        options: default_2.Options;
        tiles: Record<`${number}`, default_2.Tile>;
        tileCoords: default_2.TileCoords;
        total: number;
        stats: Record<`z${number}`, number>;
        splitTile(features: default_2.Tile, z: number, x: number, y: number, cz: number, cx: number, cy: number): void;
        getTile(z: number | string, x: number | string, y: number | string): null | default_2.Tile;
    }>;
    private drawTile;
    private _renderFeature;
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
    private _getTileTexture;
}

export declare class GeoJSONSource extends TileSource {
    dataType: string;
    style: VectorStyle;
    constructor(options: GeoJSONSourceOptions);
}

export declare type GeoJSONSourceOptions = SourceOptions & {
    style?: VectorStyle;
};

export declare class MVTLoader extends TileMaterialLoader {
    dataType: string;
    info: {
        version: string;
        author: string;
        description: string;
    };
    private _loader;
    private _render;
    constructor();
    protected doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
    /**
     * 在离屏画布上绘制矢量瓦片
     *
     * @param vectorTile 待绘制的矢量瓦片对象
     * @returns 绘制完成的图像位图
     * @throws 如果画布上下文不可用，则抛出错误
     */
    private drawTile;
    private _renderLayer;
    private _renderFeature;
}

export declare class MVTSource extends TileSource {
    dataType: string;
    constructor(options: MVTSourceOptions);
}

export declare type MVTSourceOptions = SourceOptions & {
    style?: {
        layer: VectorStyles;
    };
};

export declare type StyleType = {
    layer: VectorStyle[];
};

export { }
