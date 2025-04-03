import { BufferGeometry } from 'three';
import { default as default_2 } from 'geojson-vt';
import { ITileGeometryLoader } from 'three-tile';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SourceOptions } from 'three-tile';
import { Texture } from 'three';
import { TileMaterialLoader } from 'three-tile';
import { TileSource } from 'three-tile';
import { TileSourceLoadParamsType } from 'three-tile';
import { VectorStyle } from 'three-tile';
import { VectorStyles } from 'three-tile';

/**
 * ArcGis terrain datasource
 */
declare class ArcGisDemSource extends TileSource {
    dataType: string;
    attribution: string;
    minLevel: number;
    maxLevel: number;
    url: string;
    constructor(options?: SourceOptions);
}

/**
 *  ArcGis datasource
 */
declare class ArcGisSource extends TileSource {
    dataType: string;
    attribution: string;
    style: string;
    url: string;
    constructor(options?: ArcGisSourceOptions);
}

declare type ArcGisSourceOptions = SourceOptions & {
    style?: string;
};

/**
 * Bing datasource
 */
declare class BingSource extends TileSource {
    dataType: string;
    attribution: string;
    style: string;
    mkt: string;
    subdomains: string;
    constructor(options?: BingSourceOptions);
    getUrl(x: number, y: number, z: number): string;
}

/**
 - A：卫星图像图层（Aerial）。
 - R：道路图层（Road）。
 - H：高度图层（Height）。
 - O：鸟瞰图图层（Oblique）。
 - B：建筑物图层（Building）。
 - P：地形图层（Terrain）。
 - G：地理特征图层（Geography）。
 - T：交通图层（Traffic）。
 - L：标签图层（Label）。
 */
declare type BingSourceOptions = SourceOptions & {
    style?: string;
};

/** 罗盘类 */
export declare class Compass {
    /** 罗盘顶层dom */
    dom: HTMLDivElement;
    plane: HTMLElement | null | undefined;
    /** 罗盘中的文字 */
    text: HTMLElement | null | undefined;
    controls: OrbitControls;
    /**
     * 构造函数
     * @param controls 地图控制器
     */
    constructor(controls: OrbitControls);
}

/** 创建罗盘实例 */
export declare function createCompass(controls: OrbitControls): Compass;

declare type DEMType = {
    buffer: Float32Array;
    width: number;
    height: number;
};

/**
 * GaoDe datasource
 */
declare class GDSource extends TileSource {
    dataType: string;
    attribution: string;
    style: Style;
    subdomains: string;
    maxLevel: number;
    url: string;
    constructor(options?: GDSourceOptions);
}

declare type GDSourceOptions = SourceOptions & {
    style?: Style;
};

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

/**
 * Geoq datasource
 */
declare class GeoqSource extends TileSource {
    dataType: string;
    maxLevel: number;
    attribution: string;
    style: string;
    url: string;
    constructor(options?: GeoqSourceOptions);
}

declare type GeoqSourceOptions = SourceOptions & {
    style?: string;
};

/**
 * Google datasource, can not uese in CN
 */
declare class GoogleSource extends TileSource {
    dataType: string;
    attribution: string;
    maxLevel: number;
    style: Style_2;
    protected subdomains: string;
    url: string;
    constructor(options?: GoogleSourceOptions);
}

declare type GoogleSourceOptions = SourceOptions & {
    style?: Style_2;
};

/**
 * MapBox datasource
 */
declare class MapBoxSource extends TileSource {
    protected token: string;
    protected format: string;
    protected style: string;
    attribution: string;
    maxLevel: number;
    url: string;
    constructor(options?: MapBoxSourceOptions);
}

declare type MapBoxSourceOptions = SourceOptions & {
    style?: string;
    token: string;
};

export declare namespace mapSource {
    export {
        MapBoxSourceOptions,
        MapBoxSource,
        ArcGisSourceOptions,
        ArcGisSource,
        ArcGisDemSource,
        BingSourceOptions,
        BingSource,
        GDSourceOptions,
        GDSource,
        GeoqSourceOptions,
        GeoqSource,
        GoogleSourceOptions,
        GoogleSource,
        MapTilerSourceOptins,
        MapTilerSource,
        StadiaSource,
        TDTSourceOptins,
        TDTSource,
        TDTQMSource,
        TXSourceOptins,
        TXSource,
        ZKXTSourceOptions,
        ZKXTSource,
        ZKXTQMSource
    }
}

/**
 * MapTiler data source
 */
declare class MapTilerSource extends TileSource {
    attribution: string;
    token: string;
    format: string;
    style: string;
    url: string;
    constructor(options?: MapTilerSourceOptins);
}

declare type MapTilerSourceOptins = SourceOptions & {
    style?: string;
    token: string;
    format: string;
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

export declare class SingleImageSource extends TileSource {
    dataType: string;
    image?: HTMLImageElement;
}

/**
 * Stadia data source
 */
declare class StadiaSource extends TileSource {
    dataType: string;
    attribution: string;
    url: string;
    constructor(options?: SourceOptions);
}

/**  6卫星（st），7简图（st rd），8详图（不透明rd，透明图st）*/
declare type Style = "6" | "7" | "8";

/**
 m 标准路线图 lyrs=m
 r 某种改变的路线图（路线不明显） lyrs=r
 s 影像层（卫星图） lyrs=s
 y 带标签的卫星图 lyrs=y
 h 标签层（路名、地名等） lyrs=h
 t 地形图 lyrs=t
 p 带标签的地形图 lyrs=p
 */
declare type Style_2 = "s" | "m" | "r" | "y" | "h" | "t" | "p";

declare type Style_3 = "img_w" | "cia_w" | "cva_w" | "ibo_w" | "ter_w" | "vec_w" | "cta_w" | "img_c" | "cia_c";

declare type Style_4 = "img" | "cia" | "terrain_rgb";

export declare type StyleType = {
    layer: VectorStyle[];
};

declare class TDTQMSource extends TileSource {
    dataType: string;
    attribution: string;
    token: string;
    subdomains: string;
    url: string;
    constructor(options?: TDTSourceOptins);
}

/**
 * TianDiTu datasource
 */
declare class TDTSource extends TileSource {
    dataType: string;
    attribution: string;
    token: string;
    style: Style_3;
    subdomains: string;
    url: string;
    constructor(options?: TDTSourceOptins);
}

declare type TDTSourceOptins = SourceOptions & {
    style?: Style_3;
    token: string;
};

/**
 * TIF DEM terrain loader
 */
export declare class TifDEMLoder implements ITileGeometryLoader {
    readonly info: {
        version: string;
        description: string;
    };
    readonly dataType: string;
    private _loader;
    /**
     * 构造函数，初始化 TifDEMLoder 实例
     */
    constructor();
    /**
     * 加载瓦片的几何体数据
     * @param params 包含加载瓦片所需的参数，类型为 TileSourceLoadParamsType<TifDemSource>
     * @returns 加载完成后返回一个 BufferGeometry 对象
     */
    load(params: TileSourceLoadParamsType<TifDemSource>): Promise<BufferGeometry>;
    /**
     * 从 ArrayBuffer 中读取 TIFF 图像的栅格数据
     * @param buffer 包含 TIFF 图像数据的 ArrayBuffer
     * @returns 包含栅格数据的对象，包含 buffer、width 和 height 属性
     */
    private getTIFFRaster;
    /**
     * 获取指定瓦片的数字高程模型（DEM）数据
     * @param raster 包含DEM数据的对象，具有buffer、width和height属性
     * @param sourceProjBbox 原始数据的投影边界框，格式为 [xMin, yMin, xMax, yMax]
     * @param tileBounds 瓦片的边界框，格式为 [xMin, yMin, xMax, yMax]
     * @param targetSize 目标数据的大小，用于指定输出数据的宽度和高度
     * @returns 经过处理后的DEM数据数组，除以1000得到km单位高程
     */
    private getTileDEM;
}

export declare class TifDemSource extends TileSource {
    dataType: string;
    data?: DEMType;
}

/** Tencent datasource */
declare class TXSource extends TileSource {
    dataType: string;
    style: string;
    attribution: string;
    subdomains: string;
    maxLevel: number;
    isTMS: boolean;
    sx: number;
    sy: number;
    url: string;
    constructor(options?: TXSourceOptins);
    _getUrl(x: number, y: number, z: number): string | undefined;
}

declare type TXSourceOptins = SourceOptions & {
    style?: string;
};

declare class ZKXTQMSource extends TileSource {
    dataType: string;
    attribution: string;
    token: string;
    subdomains: string;
    url: string;
    constructor(options?: ZKXTSourceOptions);
}

/**
 * ZhongkeXingTu datasource
 */
declare class ZKXTSource extends TileSource {
    readonly attribution = "\u4E2D\u79D1\u661F\u56FE[GS(2022)3995\u53F7]";
    token: string;
    style: Style_4;
    format: string;
    subdomains: string;
    url: string;
    constructor(options?: ZKXTSourceOptions);
}

declare type ZKXTSourceOptions = SourceOptions & {
    style?: Style_4;
    token: string;
    format?: string;
};

export { }


declare module "three-tile" {
    namespace plugin {
        function myCustomFunction(param: string): void;
        const myCustomConstant: number;
        interface MyCustomInterface {
            prop: string;
        }
    }
}
