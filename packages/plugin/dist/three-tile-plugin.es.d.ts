import { AmbientLight } from 'three';
import { BaseEvent } from 'three';
import { BufferGeometry } from 'three';
import { Camera } from 'three';
import { Color } from 'three';
import { ColorRepresentation } from 'three';
import { DirectionalLight } from 'three';
import { EventDispatcher } from 'three';
import { FogExp2 } from 'three';
import { ITileGeometryLoader } from 'three-tile';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { Mesh } from 'three';
import { Object3DEventMap } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerspectiveCamera } from 'three';
import { Scene } from 'three';
import { ShaderMaterial } from 'three';
import { SourceOptions } from 'three-tile';
import { TileMap } from 'three-tile';
import { TileSource } from 'three-tile';
import { TileSourceLoadParamsType } from 'three-tile';
import { Vector3 } from 'three';
import { WebGLRenderer } from 'three';

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

export declare function createFog(controls: MapControls, fogColor?: ColorRepresentation): MapFog;

export declare type CreateFogParams = {
    controls: MapControls;
    fogColor?: ColorRepresentation;
};

export declare function createFrakEarth(map: TileMap, bkColor?: ColorRepresentation, airColor?: ColorRepresentation): FakeEarth;

declare type DEMType = {
    buffer: Float32Array;
    width: number;
    height: number;
};

/**
 * a fake ball Material
 */
export declare class EarthMaskMaterial extends ShaderMaterial {
    constructor(parameters: {
        bkColor: Color;
        airColor: Color;
    });
}

/**
 * A Earth ball mask
 */
export declare class FakeEarth extends Mesh<BufferGeometry, EarthMaskMaterial> {
    get bkColor(): Color;
    set bkColor(value: Color);
    constructor(bkColor: Color, airColor?: Color);
}

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

export declare function getAttributions(map: TileMap): string[];

export declare function getLocalFromMouse(pointerEvent: PointerEvent, map: TileMap, camera: Camera): Vector3 | undefined;

/**
 * threejs scene viewer initialize class
 */
export declare class GLViewer extends EventDispatcher<GLViewerEventMap> {
    readonly scene: Scene;
    readonly renderer: WebGLRenderer;
    readonly camera: PerspectiveCamera;
    readonly controls: MapControls;
    readonly ambLight: AmbientLight;
    readonly dirLight: DirectionalLight;
    readonly container: HTMLElement;
    private readonly _clock;
    private _fogFactor;
    get fogFactor(): number;
    set fogFactor(value: number);
    get width(): number;
    get height(): number;
    constructor(container: HTMLElement | string, options?: GLViewerOptions);
    private _createScene;
    private _createRenderer;
    private _createCamera;
    private _createControls;
    private _createAmbLight;
    private _createDirLight;
    resize(): this;
    private animate;
    /**
     * Fly to a position
     * @param centerPostion Map center target position
     * @param cameraPostion Camera target position
     * @param animate animate or not
     */
    flyTo(centerPostion: Vector3, cameraPostion: Vector3, animate?: boolean, onComplete?: (obj: Vector3) => void): void;
    /**
     * Get current scens state
     * @returns center position and camera position
     */
    getState(): {
        centerPosition: Vector3;
        cameraPosition: Vector3;
    };
}

/**
 * GlViewer event map
 */
export declare interface GLViewerEventMap extends Object3DEventMap {
    update: BaseEvent & {
        delta: number;
    };
}

/**
 * GlViewer options
 */
declare type GLViewerOptions = {
    antialias?: boolean;
    stencil?: boolean;
    logarithmicDepthBuffer?: boolean;
};

/**
 * Google datasource, can not uese in CN
 */
declare class GoogleSource extends TileSource {
    dataType: string;
    attribution: string;
    maxLevel: number;
    style: Style_2;
    subdomains: string;
    url: string;
    constructor(options?: GoogleSourceOptions);
}

declare type GoogleSourceOptions = SourceOptions & {
    style?: Style_2;
};

export declare function limitCameraHeight(map: TileMap, camera: PerspectiveCamera, limitHeight?: number): boolean;

export declare type LimitCameraHeightParams = {
    camera: PerspectiveCamera;
    limitHeight?: number;
};

/**
 * MapBox datasource
 */
declare class MapBoxSource extends TileSource {
    token: string;
    format: string;
    style: string;
    attribution: string;
    maxLevel: number;
    url: string;
    constructor(options?: MapBoxSourceOptions);
}

declare type MapBoxSourceOptions = SourceOptions & {
    style?: string;
    token: string;
};

export declare class MapFog extends FogExp2 {
    private _controls;
    private _factor;
    get factor(): number;
    set factor(value: number);
    constructor(controls: OrbitControls, color: ColorRepresentation);
}

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
