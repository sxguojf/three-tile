import { AmbientLight } from 'three';
import { Box2 } from 'three';
import { BufferGeometry } from 'three';
import { Camera } from 'three';
import { Color } from 'three';
import { ColorSpace } from 'three';
import { DirectionalLight } from 'three';
import { Event as Event_2 } from 'three';
import { EventDispatcher } from 'three';
import { Intersection } from 'three';
import { Loader } from 'three';
import { LoadingManager } from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls';
import { Material } from 'three';
import { Mesh } from 'three';
import type { NormalBufferAttributes } from 'three';
import { PerspectiveCamera } from 'three';
import { PlaneGeometry } from 'three';
import { Raycaster } from 'three';
import { Scene } from 'three';
import { ShaderMaterial } from 'three';
import { Texture } from 'three';
import { Vector2 } from 'three';
import { Vector3 } from 'three';
import { WebGLRenderer } from 'three';

declare class ArcGisDemSource extends BaseSource {
    dataType: string;
    attribution: string;
    maxLevel: number;
    url: string;
    constructor(options?: SourceOptions);
}

declare class ArcGisSource extends BaseSource {
    dataType: string;
    attribution: string;
    style: string;
    url: string;
    constructor(options?: ArcGisSourceOptions);
}

declare type ArcGisSourceOptions = SourceOptions & {
    style?: string;
};

export declare const author: {
    name: string;
    email: string;
};

/**
 * base source class, custom source can inherit from it
 */
export declare class BaseSource implements ISource {
    dataType: string;
    attribution: string;
    minLevel: number;
    maxLevel: number;
    projection: ProjectionType_2;
    url: string;
    protected subdomains: string[] | string;
    protected s: string;
    colorSpace: ColorSpace;
    opacity: number;
    bounds: [number, number, number, number];
    [name: string]: any;
    /**
     * get url callback function, overwrite it to convt orgin xyz to new xzy
     */
    onGetUrl?: ((x: number, y: number, z: number) => {
        x: number;
        y: number;
        z: number;
    }) | undefined;
    /**
     * constructor
     * @param options
     */
    constructor(options?: SourceOptions);
    /**
     * get url from tile coordinate, public
     * @param x
     * @param y
     * @param z
     * @returns url
     */
    getTileUrl(x: number, y: number, z: number): string | undefined;
    /**
     * get url from tile coordinate, protected, overwrite to custom generation tile url from xyz
     * @param x
     * @param y
     * @param z
     * @returns url
     */
    protected getUrl(x: number, y: number, z: number): string | undefined;
    /**
     * source factory function, create source directly through factoy functions.
     * @param options
     * @returns ISource
     */
    static create(options: SourceOptions): BaseSource;
}

declare class BingSource extends BaseSource {
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

/**
 * a fake ball Material
 */
declare class EarthMaskMaterial extends ShaderMaterial {
    constructor(parameters: {
        bkColor: Color;
        airColor: Color;
    });
}

declare class FakeEarth extends Mesh<BufferGeometry, EarthMaskMaterial> {
    get bkColor(): Color;
    set bkColor(value: Color);
    constructor(bkColor: Color, airColor?: Color);
}

/**
 * overwriter threejs.FileLoader，add abortSignal to abort load
 */
export declare class FileLoaderEx extends Loader {
    mimeType?: string;
    responseType?: string;
    constructor(manager: LoadingManager);
    load(url: string, onLoad?: (response: any) => void, _onProgress?: (request: ProgressEvent) => void, onError?: (event: ErrorEvent | DOMException) => void, abortSignal?: AbortSignal): any;
    setResponseType(value: string): this;
    setMimeType(value: string): this;
}

declare class GDSource extends BaseSource {
    dataType: string;
    attribution: string;
    style: Style;
    subdomains: string;
    maxLevel: number;
    url: string;
    constructor(options?: GDSourceOptions);
}

declare type GDSourceOptions = SourceOptions & {
    style?: string;
};

declare class GeoqSource extends BaseSource {
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
 * get url and rect for max level tile
 * to load greater than max level from source,  had to load from max level.
 * 因为瓦片数据并未覆盖所有级别瓦片，如MapBox地形瓦片最高只到15级，如果要显示18级以上瓦片，不能从17级瓦片中获取，只能从15级瓦片里截取一部分
 * @param source
 * @param tile
 * @returns max tile url and rect in  in maxTile
 */
export declare function getSafeTileUrlAndRect(source: ISource, tile: Tile): {
    url: string | undefined;
    rect: Box2;
};

/**
 * threejs scene viewer initialize class
 */
declare class GLViewer extends EventDispatcher<Event_2> {
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
    constructor(dom: HTMLElement, centerPositon?: Vector3, cameraPosition?: Vector3);
    private _createScene;
    private _createRenderer;
    private _createCamera;
    private _createControls;
    private _createAmbLight;
    private _createDirLight;
    resize(): this;
    private animate;
}

declare class GoogleSource extends BaseSource {
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
 *  image load with abording
 *
 * orverwrite threejs.ImageLoader，load using fetch，added abortSignal to abort load.
 *
 * https://github.com/mrdoob/three.js/issues/10439#issuecomment-275785639
 * 因fetch下载图像有一些问题，threej在r83回滚，使用Image加载图像，Image无法中止，故重新该类添加中止下载标志。
 */
export declare class ImageLoaderEx extends Loader {
    private loader;
    constructor(manager: LoadingManager);
    /**
     * load image
     * @param url imageurl
     * @param onLoad callback when loaded and abort and error
     * @param onProgress callback when progress
     * @param onError callback when error
     * @param abortSignal signal of abort loading
     * @returns image
     */
    load(url: string, onLoad?: (image: HTMLImageElement) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent | DOMException | Event) => void, abortSignal?: AbortSignal): HTMLImageElement;
}

/**
 * Porjection interface
 */
export declare interface IProjection {
    ID: ProjectionType;
    mapWidth: number;
    mapHeight: number;
    mapDepth: number;
    isWGS: boolean;
    project(lon: number, lat: number, centralMeridian: number): {
        x: number;
        y: number;
    };
    unProject(x: number, y: number, centralMeridian: number): {
        lon: number;
        lat: number;
    };
}

/**
 * Source interface
 * all source implements ISource get url from x/y/z coordinate to url
 */
export declare interface ISource {
    dataType: string;
    attribution: string;
    minLevel: number;
    maxLevel: number;
    projection: ProjectionType_2;
    colorSpace: ColorSpace;
    opacity: number;
    bounds: [number, number, number, number];
    getTileUrl: SourceUrl;
    onGetUrl?: (x: number, y: number, z: number) => {
        x: number;
        y: number;
        z: number;
    };
}

/** geometry loader interface */
export declare interface ITileGeometryLoader {
    dataType: string;
    load(source: ISource, tile: Tile, onLoad: () => void, onError: (err: any) => void): BufferGeometry;
}

/**
 * Tile loader interface
 */
export declare interface ITileLoader {
    manager: LoadingManager;
    imgSource: ISource[];
    demSource: ISource | undefined;
    cacheSize: number;
    load(tile: Tile, onLoad: () => void, onError: (err: any) => void): void;
}

/**  Material loader interface */
export declare interface ITileMaterialLoader {
    dataType: string;
    load(source: ISource, tile: Tile, onLoad: () => void, onError: (err: any) => void): Material;
}

/**
 * factory for loader
 */
export declare class LoaderFactory {
    static manager: LoadingManager;
    private static demLoaderMap;
    private static imgLoaderMap;
    /**
     * register material loader
     * @param loader material loader
     */
    static registerMaterialLoader(loader: ITileMaterialLoader): void;
    /**
     * register geometry loader
     * @param loader geometry loader
     */
    static registerGeometryLoader(loader: ITileGeometryLoader): void;
    /**
     * get material loader from datasource
     * @param source datasource
     * @returns material loader
     */
    static getMaterialLoader(source: ISource): ITileMaterialLoader;
    /**
     * get geometry loader from datasource
     * @param source datasouce
     * @returns geometry loader
     */
    static getGeometryLoader(source: ISource): ITileGeometryLoader;
}

/**
 * state of tile data
 */
export declare type LoadState = "empty" | "loading" | "loaded";

/**
 * ground location inifo type
 */
declare interface LocationInfo extends Intersection {
    location: Vector3;
}

declare class MapBoxSource extends BaseSource {
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

/**
 * Type of map constructor parameters
 * 地图构造函数参数
 */
export declare type MapContructParams = {
    loader: ITileLoader;
    rootTile?: RootTile;
    minLevel?: number;
    maxLevel?: number;
    centralMeridian?: 0 | 90 | -90;
};

/**
 * Type of map create parameters
 * 地图创建参数
 */
export declare type MapParams = {
    imgSource: ISource[] | ISource;
    demSource?: ISource;
    minLevel?: number;
    maxLevel?: number;
    centralMeridian?: 0 | 90 | -90;
};

declare class MapTilerSource extends BaseSource {
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

declare namespace plugin {
    export {
        GLViewer,
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
        TXSourceOptins,
        TXSource,
        ZKXTSourceOptions,
        ZKXTSource,
        EarthMaskMaterial,
        FakeEarth
    }
}
export { plugin }

/**
 * abstruct projection base class
 */
export declare abstract class Projection {
    isWGS: boolean;
    /**
     * create projection object from projection ID
     *
     * @param id projeciton ID, default: "3857"
     * @returns IProjection instance
     */
    static createFromID(id?: ProjectionType): IProjection;
    /**
     * create projection object from map source
     * @param source map source
     * @returns IProjection instance
     */
    static createFromSource(source: ISource): IProjection;
}

export declare type ProjectionType = "3857" | "4326";

declare type ProjectionType_2 = "3857" | "4326";

export declare class ProjMCT extends Projection implements IProjection {
    readonly ID = "3857";
    readonly isWGS = false;
    mapWidth: number;
    mapHeight: number;
    mapDepth: number;
    /**
     * Latitude and longitude to projected coordinates
     * @param lon longitude
     * @param lat Latitude
     * @returns projected coordinates
     */
    project(lon: number, lat: number, centralMeridian: number): {
        x: number;
        y: number;
    };
    /**
     * Projected coordinates to latitude and longitude
     * @param x projection x
     * @param y projection y
     * @returns latitude and longitude
     */
    unProject(x: number, y: number, centralMeridian: number): {
        lat: number;
        lon: number;
    };
}

export declare class ProjWGS extends Projection implements IProjection {
    readonly ID = "4326";
    readonly isWGS = true;
    mapWidth: number;
    mapHeight: number;
    mapDepth: number;
    project(lon: number, lat: number, centralMeridian: number): {
        x: number;
        y: number;
    };
    unProject(x: number, y: number, centralMeridian: number): {
        lon: number;
        lat: number;
    };
}

/**
 * get bounds from rect
 * @param rect
 * @param imgSize
 * @returns
 */
export declare function rect2ImageBounds(rect: Box2, imgSize: number): {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
};

/**
 * image resize
 * @param image source image
 * @param size dest size
 * @returns canvas
 */
export declare function resizeImage(image: HTMLImageElement, size: number): HTMLImageElement | HTMLCanvasElement;

/**
 * Root tile, it is a  QuadTree extends Tile.
 * note: update() function is called on the scene update every frame it is rendered.
 */
export declare class RootTile extends Tile {
    private _treeReadyCount;
    private _autoLoad;
    private _loader;
    private _minLevel;
    /**
     * Get the map minLevel
     */
    get minLevel(): number;
    /**
     * Set the map minLevel,
     */
    set minLevel(value: number);
    private _maxLevel;
    /**
     * Get the map maxLevel
     */
    get maxLevel(): number;
    /**
     * Set the map maxLevel
     */
    set maxLevel(value: number);
    private _LODThreshold;
    /**
     * Get the map LOD threshold
     */
    get LODThreshold(): number;
    /**
     * Set the map LOD threshold
     */
    set LODThreshold(value: number);
    /**
     * Is the map WGS projection
     */
    isWGS: boolean;
    /**
     * Get the tile loader
     */
    get loader(): ITileLoader;
    /**
     * Set the tile loader
     */
    set loader(value: ITileLoader);
    /**
     * Get whether allow tile data to update, default true.
     */
    get autoLoad(): boolean;
    /**
     * Set whether allow tile data to update, default true.
     * true: auto load data on the scene update every frame it is rendered.
     * false: only update quad tree on render.
     */
    set autoLoad(value: boolean);
    private _vierwerBufferSize;
    private _tileBox;
    /**
     * Get the renderer cache size scale. (0.5-2.5，default: 0.6)
     */
    get viewerbufferSize(): number;
    /**
     * Get the renderer cache size. (0.5-2.5，default: 0.6)
     */
    set viewerbufferSize(value: number);
    /**
     * constructor
     * @param loader tile data loader
     * @param level tile level, default:0
     * @param x tile X-coordinate, default:0
     * @param y tile y-coordinate, default:0
     */
    constructor(loader: ITileLoader, level?: number, x?: number, y?: number);
    /**
     * update the quadTree and tile data
     * @param camera
     */
    update(camera: Camera): this;
    /**
     * reload data, Called to take effect after source is modified
     */
    reload(): this;
    /**
     * update the tile tree use LOD
     * @param cameraWorldPosition positon of the camera
     * @returns  the tile tree has changed
     */
    private _updateTileTree;
    /**
     *  update tileTree data.
     *  traverse the tiles to load data and update tiles visible.
     */
    private _updateTileData;
    /**
     * update the tile visible when tile loaded
     * @returns all of tile has loaded?
     */
    private _updateVisible;
    /**
     * update the tiles height
     */
    private _updateVisibleZ;
}

/**
 * source construtor params type
 */
export declare type SourceOptions = {
    dataType?: string;
    attribution?: string;
    minLevel?: number;
    maxLevel?: number;
    projection?: string;
    colorSpace?: ColorSpace;
    opacity?: number;
    bounds?: [number, number, number, number];
    url?: SourceUrl | string;
    subdomains?: string[] | string;
    [name: string]: any;
};

/**
 * a callback function for conver tile x/y/z to url
 */
export declare interface SourceUrl {
    (x: number, y: number, z: number): string | undefined;
}

declare class StadiaSource extends BaseSource {
    dataType: string;
    attribution: string;
    url: string;
    constructor(options?: SourceOptions);
}

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

/**
 * 瓦片样式
 */
declare type Style_3 = "img_w" | "cia_w" | "cva_w" | "ibo_w" | "ter_w" | "vec_w" | "cta_w" | "img_c" | "cia_c";

/**
 * 瓦片样式
 */
declare type Style_4 = "img" | "cia" | "terrain_rgb";

declare class TDTSource extends BaseSource {
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
 * class Tile, inherit of Mesh
 */
export declare class Tile extends Mesh<BufferGeometry, Material[]> {
    /** coordinate of tile */
    readonly coord: TileCoord;
    /** is a tile? */
    readonly isTile = true;
    /** tile parent */
    readonly parent: this | null;
    /** children of tile */
    readonly children: this[];
    /** max height of tile */
    maxZ: number;
    /** min height of tile */
    minZ: number;
    /** avg height of tile */
    avgZ: number;
    /** index of tile, mean positon in parent.
     *  (0:left-bottom, 1:right-bottom,2:left-top、3:right-top、-1:parent is null）
     */
    get index(): number;
    private _abortController;
    /** singnal of abort when downloading  */
    get abortSignal(): AbortSignal;
    private _loadState;
    /** get the tile load state*/
    get loadState(): LoadState;
    private _toLoad;
    /** needs to load? */
    private get _needsLoad();
    private _inFrustum;
    /** tile in frustum? */
    get inFrustum(): boolean;
    /** set the tile in frustum */
    protected set inFrustum(value: boolean);
    /** is the tile  leaf in frustum ? */
    get isLeafInFrustum(): boolean;
    /** set the tile to temp*/
    set isTemp(temp: boolean);
    /** is tile leaf?  */
    get isLeaf(): boolean;
    /**
     * constructor
     * @param x tile X-coordinate, default:0
     * @param y tile X-coordinate, default:0
     * * @param z tile level, default:0
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     * Override Obejct3D.traverse, change the callback param to "this"
     * @param callback callback
     */
    traverse(callback: (object: this) => void): void;
    /**
     * Override mesh.raycast，only when tile has loaded
     * @param raycaster
     * @param intersects
     */
    raycast(raycaster: Raycaster, intersects: Intersection[]): void;
    /**
     * Level Of Details
     * @param camera
     * @param minLevel min level for LOD
     * @param maxLevel max level for LOD
     * @param threshold threshold for LOD
     * @param isWGS is WGS projection?
     * @returns new tiles
     */
    protected _lod(camera: Camera, minLevel: number, maxLevel: number, threshold: number, isWGS: boolean): Tile[];
    /**
     * load tile data
     * @param loader data loader
     * @returns update visible of tiles ?
     */
    protected _load(loader: ITileLoader): Promise<boolean>;
    /**
     * callback function when error. (include abort)
     * @param err error message
     * @returns
     */
    private _onError;
    /**
     * recursion tile tree to find loaded parent (hide when parent showing)
     * @returns loaded parent or null
     */
    hasLoadedParent(): this | null;
    /**
     * callback function on loaded
     */
    private _onLoad;
    private _updateZ;
    /**
     * abort download
     */
    abortLoad(): void;
    /**
     * free the tile
     * @param removeChildren 是否移除子瓦片
     */
    dispose(removeChildren: boolean): this;
    private _dispose;
}

/**
 * coordinate of tile
 */
export declare type TileCoord = {
    x: number;
    y: number;
    z: number;
};

/**
 * create geomety from rules grid dem and it has a skrit
 */
export declare class TileGridGeometry extends PlaneGeometry {
    private _min;
    /**
     * buile
     * @param dem 2d array of dem
     * @param tileSize tile size
     */
    protected build(dem: ArrayLike<number>, tileSize: number): this;
    /**
     * set the tile dem data
     * @param dem 2d dem array
     * @param tileSize dem size
     * @returns this
     */
    setData(dem: ArrayLike<number>, tileSize: number): this;
    computeVertexNormals(): void;
}

/**
 * tile loader
 */
export declare class TileLoader extends Loader implements ITileLoader {
    /** get loader cache size of file  */
    get cacheSize(): number;
    /** set loader cache size of file  */
    set cacheSize(value: number);
    private _imgSource;
    /** get image source */
    get imgSource(): ISource[];
    /** set image source */
    set imgSource(value: ISource[]);
    private _demSource;
    /** get dem source */
    get demSource(): ISource | undefined;
    /** set dem source */
    set demSource(value: ISource | undefined);
    /**
     * constructor
     * @param imgSource image dataSource
     * @param demSource dem dataSource
     */
    constructor(imgSource?: ISource[], demSource?: ISource);
    /**
     * load material and geometry data
     * @param tile tile to load
     * @param onLoad callback on data loaded
     * @returns geometry, material(s)
     */
    load(tile: Tile, onLoad: () => void, onError: (err: any) => void): {
        geometry: BufferGeometry<NormalBufferAttributes>;
        material: Material[];
    };
    /**
     * load geometry
     * @param tile tile to load
     * @param onLoad loaded callback
     * @param onError error callback
     * @returns geometry
     */
    protected loadGeometry(tile: Tile, onLoad: () => void, onError: (err: any) => void): BufferGeometry;
    /**
     * load material
     * @param tile tile to load
     * @param onLoad loaded callback
     * @param onError error callback
     * @returns material
     */
    protected loadMaterial(tile: Tile, onLoad: () => void, onError: (err: any) => void): Material[];
}

/**
 * Map Mesh
 * 地图模型
 *
 * @event loading-start
 * @event loading-error
 * @event loading-complete
 * @event loading-progress
 *
 * @event tile-created
 * @event tile-loaded
 *
 * @event update
 * @event source-changed
 * @event projection-changed
 *
 */
export declare class TileMap extends Mesh {
    private readonly _clock;
    readonly isLOD = true;
    /**
     * 瓦片是否在每帧渲染时自动更新
     * Whether the LOD object is updated automatically by the renderer per frame or not.
     * If set to false, you have to call LOD.update() in the render loop by yourself. Default is true.
     */
    autoUpdate: boolean;
    /**
     * Root tile, it is the root node of tile tree.
     * 根瓦片
     */
    readonly rootTile: RootTile;
    /**
     * Map data loader, it used for load tile data and create tile geometry/Material
     * 地图数据加载器
     */
    readonly loader: ITileLoader;
    /**
     * Get min level of map
     * 取得地图最小缩放级别，小于这个级别瓦片树不再更新
     */
    get minLevel(): number;
    /**
     * Set max level of map
     * 设置地图最小缩放级别，小于这个级别瓦片树不再更新
     */
    set minLevel(value: number);
    /**
     * Get max level of map
     * 取得地图最大缩放级别，大于这个级别瓦片树不再更新
     */
    get maxLevel(): number;
    /**
     * Set max level of map
     * 设置地图最大缩放级别，大于这个级别瓦片树不再更新
     */
    set maxLevel(value: number);
    /**
     * Whether the LOD object is load data automatically by the renderer per frame or not.
     * 取得是否在每帧渲染时按需更新瓦片数据
     */
    get autoLoad(): boolean;
    /**
     * Get whether the LOD object is load data automatically by the renderer per frame or not.
     * 设置是否在每帧渲染时按需更新瓦片数据
     */
    set autoLoad(value: boolean);
    private _autoAdjustZ;
    /**
     * Get whether to adjust z of map automatically.
     * 取得是否自动根据视野内地形高度调整地图Z坐标
     */
    get autoAdjustZ(): boolean;
    /**
     * Set whether to adjust z of map automatically.
     * 设置是否自动调整地图Z坐标，如果设置为true，将在每帧渲染中将地图Z坐标调整可视区域瓦片的平均高度
     */
    set autoAdjustZ(value: boolean);
    /**
     * Get the number of  download cache files.
     * 取得瓦片下载缓存文件数量。
     */
    get loadCacheSize(): number;
    /**
     * Set the number of  download cache files.
     * 设置瓦片下载缓存文件数量。使用该属性限制缓存瓦片数量，较大的缓存能加快数据下载速度，但会增加内存使用量，一般取<1000。
     */
    set loadCacheSize(value: number);
    /**
     * Get the render cache size. Default:1.2
     * 取得瓦片渲染缓冲大小
     */
    get viewerBufferSize(): number;
    /**
     * Set the render cache size. Default:1.2.
     * 设置瓦片视图缓冲大小（取值范围1.2-5.0，默认1.2）.
     * 在判断瓦片是否在可视范围时，将瓦片大小扩大该属性倍来判断，可预加载部分不在可视范围的瓦片，增大viewerBufferSize可预加载较多瓦片，但也增大了数据下载量并占用更多资源。
     */
    set viewerBufferSize(value: number);
    /**
     * Get max height in view
     * 取得可视范围内瓦片的最高高度
     */
    get maxZInView(): number;
    /**
     * Set min height in view
     * 取得可视范围内瓦片的最低高度
     */
    get minZInView(): number;
    /**
     * Get avg hegiht in view
     * 取得可视范围内瓦片的平均高度
     */
    get avgZInView(): number;
    private _centralMeridian;
    /**
     * Get central Meridian latidute
     * 取得子午线经度
     */
    get centralMeridian(): number;
    /**
     * Set central Meridian latidute, default:0
     * 设置子午线经度，子午线经度决定了地图的投影中心经度，可设置为-90，0，90
     */
    set centralMeridian(value: number);
    private _projection;
    /**
     * Set the map projection object
     * 取得地图投影对象
     */
    get projection(): IProjection;
    /**
     * Get the map projection object
     * 设置地图投影对象
     */
    private set projection(value);
    /**
     * Get the image data source object
     * 取得影像数据源
     */
    get imgSource(): ISource | ISource[];
    /**
     * Set the image data source object
     * 设置影像数据源
     */
    set imgSource(value: ISource | ISource[]);
    /**
     * Get the terrain data source
     * 设置地形数据源
     */
    get demSource(): ISource | undefined;
    /**
     * Set the terrain data source
     * 取得地形数据源
     */
    set demSource(value: ISource | undefined);
    /**
     * Get LOD threshold
     * 取得LOD阈值
     */
    get LODThreshold(): number;
    /**
     * Set LOD threshold
     * 设置LOD阈值，LOD阈值越大，使用更多瓦片显示，地图越清晰，但耗费资源越高，建议取0.8-5之间
     */
    set LODThreshold(value: number);
    /**
     * Create a map using factory function
     * 地图创建工厂函数
     @param params 地图参数 {@link MapParams}
     @returns map mesh 地图模型
     @example
     ``` typescript
     TileMap.create({
     // 影像数据源
     imgSource: [Source.mapBoxImgSource, new TestSource()],
     // 高程数据源
     demSource: source.mapBoxDemSource,
     // 地图投影中心经度
     centralMeridian: 90,
     // 最小缩放级别
     minLevel: 1,
     // 最大缩放级别
     maxLevel: 18,
     });
     ```
     */
    static create(params: MapParams): TileMap;
    /**
     * Map mesh constructor
     *
     * 地图模型构造函数
     * @param params 地图构造参数 {@link MapContructParams}     *
     * @example
     * ``` typescript
     *  const imgSource = [Source.mapBoxImgSource, new tt.TestSource()];
     *  const demSource = Source.mapBoxDemSource;
     *  const loader = new tt.TileLoader(imgSource, demSource, 2, 18);
     *  const map = new TileMap({ loader, centralMeridian: 90 });
     * ```
     */
    constructor(params: MapContructParams);
    private _setTileCoordConvert;
    private _setMapProjection;
    /**
     * Update the map, It is automatically called after mesh adding a scene
     * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
     * @param camera
     */
    update(camera: Camera): void;
    /**
     * reload the map data，muse called after the source has changed
     * 重新加载地图，在改变地图数据源后调用它才能生效
     */
    reload(): void;
    /**
     * dispose map.
     * todo: remve event.
     * 释放地图资源，并移出场景
     */
    dispose(): void;
    /**
     * Get map data attributions information
     * 取得地图数据归属版权信息
     * @returns Attributions 版权信息数组
     */
    get attributions(): string[];
    /**
     * Geo coordinates converted to model coordinates
     * 地理坐标转换为地图模型坐标
     * @param geo 地理坐标（经纬度）
     * @returns 模型坐标
     */
    geo2pos(geo: Vector3): Vector3;
    /**
     * Model coordinates converted to coordinates geo
     * 模型坐标转换为地理坐标
     * @param pos 模型坐标
     * @returns 地理坐标（经纬度）
     */
    pos2geo(pos: Vector3): Vector3;
    /**
     * Get the ground infomation for the specified latitude and longitude
     * 获取指定经纬度的地面信息（法向量、高度等）
     * @param geo 地理坐标
     * @returns 地面信息
     */
    getLocalInfoFromGeo(geo: Vector3): LocationInfo | undefined;
    /**
     * Get loacation infomation from world position
     * 获取指定世界坐标的地面信息
     * @param pos 世界坐标
     * @returns 地面信息
     */
    getLocalInfoFromWorld(pos: Vector3): LocationInfo | undefined;
    /**
     * Get loacation infomation from screen point
     * 获取指定屏幕坐标的地面信息
     * @param camera 摄像机
     * @param pointer 点的屏幕坐标（-0.5~0.5）
     * @returns 位置信息（经纬度、高度等）
     */
    getLocalInfoFromScreen(camera: Camera, pointer: Vector2): LocationInfo | undefined;
    /**
     * Get map tiles statistics to debug
     * @returns 取得瓦片统计信息，用于调试性能
     */
    getTileCount(): {
        total: number;
        visible: number;
        leaf: number;
        maxLevle: number;
    };
    /**
     * Listen tile event.
     * 监听瓦片数据加载等事件，并将事件挂接到TileMap上以方便使用
     */
    private _attachEvent;
}

/**
 * Tile shade, include multiple textures and pixel to Z
 */
export declare class TileMaterial extends ShaderMaterial {
    constructor(parameters: TileMaterialParameters);
    dispose(): void;
    defineProperty(propertyName: string): void;
}

export declare interface TileMaterialParameters {
    map?: Texture | null | undefined;
    map1?: Texture | null | undefined;
    transparent?: boolean;
    wireframe?: boolean;
    diffuse?: Color;
}

/**
 * create geomety from rules grid dem, it has gap between tiles
 */
export declare abstract class TileSimpleGeometry extends PlaneGeometry {
    protected build(dem: ArrayLike<number>, tileSize: number): void;
    setData(dem: ArrayLike<number>, tileSize: number): this;
}

/**
 * texture loader
 */
export declare class TileTextureLoader {
    private loader;
    /**
     * load the tile texture
     * @param tile tile to load
     * @param source datasource
     * @param onLoad callback
     * @returns texture
     */
    load(source: ISource, tile: Tile, onLoad: () => void, onError: (err: ErrorEvent | DOMException | Event) => void): Texture;
}

declare class TXSource extends BaseSource {
    dataType: string;
    style: string;
    attribution: string;
    subdomains: string;
    maxLevel: number;
    constructor(options?: TXSourceOptins);
    getUrl(x: number, y: number, z: number): string;
}

declare type TXSourceOptins = SourceOptions & {
    style?: string;
};

export declare const version: string;

declare class ZKXTSource extends BaseSource {
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
