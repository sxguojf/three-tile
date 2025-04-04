import { BaseEvent } from 'three';
import { BufferGeometry } from 'three';
import { Camera } from 'three';
import { Intersection } from 'three';
import { LoadingManager } from 'three';
import { Material } from 'three';
import { Mesh } from 'three';
import { MeshStandardMaterial } from 'three';
import { MeshStandardMaterialParameters } from 'three';
import { NormalBufferAttributes } from 'three';
import { Object3DEventMap } from 'three';
import { PlaneGeometry } from 'three';
import { Raycaster } from 'three';
import { Sprite } from 'three';
import { Texture } from 'three';
import { Vector2 } from 'three';
import { Vector3 } from 'three';

/**
 * Add skirt to existing mesh
 * @param attributes - POSITION and TEXCOOD_0 attributes data
 * @param  triangles - indices array of the mesh geometry
 * @param  skirtHeight - height of the skirt geometry
 * @param  outsideIndices - edge indices from quantized mesh data
 * @returns - geometry data with added skirt
 */
export declare function addSkirt(attributes: AttributesType, triangles: Uint16Array | Uint32Array, skirtHeight: number, outsideIndices?: EdgeIndices): GeometryDataType;

export declare function attachEvent(map: TileMap): void;

/**
 *@description: Define geometry data type
 *@author: 郭江峰
 *@date: 2023-04-06
 */
/**
 * Geometry Attributes type
 */
export declare type AttributesType = {
    position: {
        value: Float32Array;
        size: number;
    };
    texcoord: {
        value: Float32Array;
        size: number;
    };
    normal: {
        value: Float32Array;
        size: number;
    };
};

export declare const author: any;

export declare function concatenateTypedArrays<T extends TypedArray>(...typedArrays: T[]): T;

export declare function createBillboards(txt: string, size?: number): Sprite<Object3DEventMap>;

export declare type EdgeIndices = {
    westIndices: Uint16Array | Uint32Array;
    southIndices: Uint16Array | Uint32Array;
    eastIndices: Uint16Array | Uint32Array;
    northIndices: Uint16Array | Uint32Array;
};

/**
 * Geometry Attributes and indices type
 */
export declare type GeometryDataType = {
    attributes: AttributesType;
    indices: Uint16Array | Uint32Array;
};

/**
 * Get bounds to clip image
 * @param clipBounds bounds [minx,miny,maxx,maxy],0-1
 * @param targetSize size to scale
 * @returns startX,StarY,width,height
 */
export declare function getBoundsCoord(clipBounds: [number, number, number, number], targetSize: number): {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
};

/**
 * 根据DEM数组计算瓦片gemetry的顶点、UV、法向量和三角形索引
 * @param dem - DEM
 * @param skirt - 是否加裙边
 * @returns - 顶点、UV、法向量和索引
 */
export declare function getGeometryDataFromDem(dem: Float32Array, skirt?: boolean): GeometryDataType;

/**
 * 获取网格索引数组
 *
 * @param height 高度
 * @param width 宽度
 * @returns 网格索引数组
 */
export declare function getGridIndices(height: number, width: number): Uint16Array;

/**
 * get ground info from an ary
 * @param map
 * @param ray
 * @returns intersect info or undefined(not intersect)
 */
export declare function getLocalInfoFromRay(map: TileMap, ray: Raycaster): LocationInfo | undefined;

/**
 * get ground info from screen coordinate
 * @param camera
 * @param pointer screen coordiante（-0.5~0.5）
 * @returns ground info
 */
export declare function getLocalInfoFromScreen(camera: Camera, map: TileMap, pointer: Vector2): LocationInfo | undefined;

/**
 * get ground info from world coordinate
 * @param worldPosition world coordinate
 * @returns ground info
 */
export declare function getLocalInfoFromWorld(map: TileMap, worldPosition: Vector3): LocationInfo | undefined;

/**
 * 根据顶点、索引计算法向量
 * @param vertices
 * @param indices
 * @param skirtIndex
 * @returns
 */
export declare function getNormals(vertices: Float32Array, indices: Uint16Array | Uint32Array): Float32Array;

/**
 * Get url and rect for max level tile
 * to load greater than max level from source,  had to load from max level.
 * 因为瓦片数据并未覆盖所有级别瓦片，如MapBox地形瓦片最高只到15级，如果要显示18级以上瓦片，不能从17级瓦片中获取，只能从15级瓦片里截取一部分
 * @param source
 * @param tile
 * @returns max tile url and bounds in  in maxTile
 */
export declare function getSafeTileUrlAndBounds(source: ISource, x: number, y: number, z: number): {
    url: string | undefined;
    clipBounds: [number, number, number, number];
};

/**
 * Porjection interface
 */
declare interface IProjection {
    readonly ID: ProjectionType_2;
    readonly mapWidth: number;
    readonly mapHeight: number;
    readonly mapDepth: number;
    readonly lon0: number;
    project(lon: number, lat: number): {
        x: number;
        y: number;
    };
    unProject(x: number, y: number): {
        lon: number;
        lat: number;
    };
    getTileXWithCenterLon(x: number, z: number): number;
    getProjBoundsFromLonLat(bounds: [number, number, number, number]): [number, number, number, number];
    getProjBoundsFromXYZ(x: number, y: number, z: number): [number, number, number, number];
    getLonLatBoundsFromXYZ(x: number, y: number, z: number): [number, number, number, number];
}

/**
 * Source interface
 * all source implements ISource get url from x/y/z coordinate to url
 */
export declare interface ISource {
    /** A string identifies the source data type, it requires the support of the loader. */
    dataType: string;
    /** Source attribution info, it allows you to display attribution*/
    attribution: string;
    /** Data max level */
    minLevel: number;
    /** Data min level */
    maxLevel: number;
    /** Data projection */
    projectionID: ProjectionType;
    /** Display opacity */
    opacity: number;
    /** is TMS scheme */
    isTMS?: boolean;
    bounds: [number, number, number, number];
    /** Data bounds in Proejction, internal use */
    _projectionBounds: [number, number, number, number];
    /** Get url from xyz, internal use */
    _getUrl(x: number, y: number, z: number): string | undefined;
    /** User data */
    userData: {
        [key: string]: unknown;
    };
}

/** Geometry Loader Interface */
export declare interface ITileGeometryLoader<TGeometry extends BufferGeometry = BufferGeometry> {
    isMaterialLoader?: false;
    /** Loader Info */
    info: ITileLoaderInfo;
    /** Tile Data Type */
    dataType: string;
    /** Use Worker? */
    useWorker?: boolean;
    /** Load Terrain Data From Source */
    load(params: TileSourceLoadParamsType): Promise<TGeometry>;
    /** Unload geometry Data */
    unload?(geometry: TGeometry): void;
}

/** Tile Loader Interface */
export declare interface ITileLoader<TMeshData extends MeshDateType = MeshDateType> {
    /** Load Tile Data */
    manager: TileLoadingManager;
    /** Image Loader */
    imgSource: ISource[];
    /** Terrain Loader */
    demSource: ISource | undefined;
    /** Use Worker? */
    useWorker: boolean;
    /** Load Tile Data */
    load(params: TileLoadParamsType): Promise<TMeshData>;
    /** Unload Tile Data */
    unload?(tileMesh: Mesh): void;
}

/** Tile Loader Info Interface */
export declare interface ITileLoaderInfo {
    /** Loader Version */
    version: string;
    /** Loader Author */
    author?: string;
    /** Loader Description */
    description?: string;
}

export declare interface ITileMaterial extends Material {
    map?: Texture | null;
}

declare interface ITileMaterial_2 extends Material {
    map?: Texture | null;
}

/** Material Loader Interface */
export declare interface ITileMaterialLoader<TMaterial extends Material = Material> {
    isMaterialLoader?: true;
    /** Loader Info */
    info: ITileLoaderInfo;
    /** Tile Data Type */
    dataType: string;
    /** Use Worker? */
    useWorker?: boolean;
    /** Load Image Data From Source */
    load(params: TileSourceLoadParamsType): Promise<TMaterial>;
    /** Unload material Data */
    unload?(material: TMaterial): void;
}

/**
 * Factory for loader
 */
export declare const LoaderFactory: {
    manager: TileLoadingManager;
    demLoaderMap: Map<string, ITileGeometryLoader<BufferGeometry<NormalBufferAttributes>>>;
    imgLoaderMap: Map<string, ITileMaterialLoader<Material>>;
    /**
     * Register material loader
     * @param loader material loader
     */
    registerMaterialLoader(loader: ITileMaterialLoader): void;
    /**
     * Register geometry loader
     * @param loader geometry loader
     */
    registerGeometryLoader(loader: ITileGeometryLoader): void;
    /**
     * Get material loader from datasource
     * @param source datasource
     * @returns material loader
     */
    getMaterialLoader(source: ISource): ITileMaterialLoader<Material>;
    /**
     * Get geometry loader from datasource
     * @param source datasouce
     * @returns geometry loader
     */
    getGeometryLoader(source: ISource): ITileGeometryLoader<BufferGeometry<NormalBufferAttributes>>;
};

/**
 * ground location inifo type
 */
export declare interface LocationInfo extends Intersection {
    location: Vector3;
}

declare enum LODAction {
    none = 0,
    create = 1,
    remove = 2
}

/**
 * Type of map create parameters
 * 地图创建参数
 */
export declare type MapParams = {
    loader?: ITileLoader;
    rootTile?: Tile;
    imgSource: ISource[] | ISource;
    demSource?: ISource;
    minLevel?: number;
    maxLevel?: number;
    lon0?: ProjectCenterLongitude;
};

/**
 * Martini mesh tile generator (Mapbox's Awesome Right-Triangulated Irregular Networks, Improved).
 *
 * Represents a height map tile node using the RTIN method from the paper "Right Triangulated Irregular Networks".
 *
 * Based off the library https://github.com/mapbox/martini.
 */
export declare class Martini {
    /**
     * Size of the grid to be generated.
     */
    gridSize: number;
    /**
     * Number of triangles to be used in the tile.
     */
    numTriangles: number;
    /**
     * Number of triangles in the parent node.
     */
    numParentTriangles: number;
    /**
     * Indices of the triangles faces.
     */
    indices: Uint32Array;
    /**
     * Coordinates of the points composing the mesh.
     */
    coords: Uint16Array;
    /**
     * Constructor for the generator.
     *
     * @param gridSize - Size of the grid.
     */
    constructor(gridSize?: number);
    createTile(terrain: Float32Array): MartiniTile;
}

/**
 * Class describes the generation of a tile using the Martini method.
 */
declare class MartiniTile {
    /**
     * Pointer to the martini generator object.
     */
    martini: Martini;
    /**
     * Terrain to generate the tile for.
     */
    terrain: Float32Array;
    /**
     * Errors detected while creating the tile.
     */
    errors: Float32Array;
    constructor(terrain: Float32Array, martini: Martini);
    update(): void;
    getGeometryData(maxError?: number): GeometryDataType;
    private _getMeshAttributes;
}

/** Tile Mesh Data Type */
export declare type MeshDateType = {
    /** Tile materials */
    materials: Material[];
    /** Tile geometry */
    geometry: BufferGeometry;
};

/**
 * 点类型
 */
export declare type Point = {
    x: number;
    y: number;
};

/**
 * Map projection center longitude type
 * 地图投影中心经度类型
 */
declare type ProjectCenterLongitude = 0 | 90 | -90;

/**
 *@description: Interface of map source
 *@author: 郭江峰
 *@date: 2023-04-05
 */
/** Project ID */
export declare type ProjectionType = "3857" | "4326";

/**
 *@description: Map projection interface
 *@author: 郭江峰
 *@date: 2023-04-06
 */
declare type ProjectionType_2 = "3857" | "4326";

/**
 * @description: PromiseWorker封装类，简化worker的使用。
 * @author: 郭江峰
 * @date: 2023-04-06
 */
export declare class PromiseWorker {
    worker: Worker;
    /**
     * 构造函数
     *
     * @param creator 创建一个 Worker 实例的函数
     */
    constructor(creator: () => Worker);
    /**
     * 异步执行worker任务，并返回结果。
     *
     * @param message 要传递给worker的消息。
     * @param transfer 可转移对象的数组，用于优化内存传输。
     * @returns 返回一个Promise，解析为worker返回的结果。
     */
    run<T = unknown>(message: Record<string, unknown>, transfer: Transferable[]): Promise<T>;
    /**
     * 终止当前工作进程。
     */
    terminate(): void;
}

export declare function registerDEMLoader(loader: ITileGeometryLoader): ITileGeometryLoader<BufferGeometry<NormalBufferAttributes>>;

export declare function registerImgLoader(loader: ITileMaterialLoader): ITileMaterialLoader<Material>;

/**
 * source construtor params type
 */
export declare interface SourceOptions {
    /** A string identifies the source data type, it requires the support of the loader. */
    dataType?: string;
    /** Source attribution info, it allows you to display attribution*/
    attribution?: string;
    /** Data max level */
    minLevel?: number;
    /** Data min level */
    maxLevel?: number;
    /** Data projection */
    projectionID?: ProjectionType;
    /** Display opacity */
    opacity?: number;
    bounds?: [number, number, number, number];
    /** Data Url template */
    url?: string;
    /** Url subdomains array or string */
    subdomains?: string[] | string;
    /** Is TMS scheme */
    isTMS?: boolean;
    /** User data */
    userData?: {
        [key: string]: unknown;
    };
}

/**
 * Class Tile, inherit of Mesh
 */
/**
 * Represents a tile in a 3D scene.
 * Extends the Mesh class with BufferGeometry and Material.
 */
export declare class Tile extends Mesh<BufferGeometry, Material[], TTileEventMap> {
    private static _downloadThreads;
    /**
     * Number of download threads.
     */
    static get downloadThreads(): number;
    /** Coordinate of tile */
    readonly x: number;
    readonly y: number;
    readonly z: number;
    /** Is a tile? */
    readonly isTile = true;
    /** Tile parent */
    readonly parent: this | null;
    /** Children of tile */
    readonly children: this[];
    private _ready;
    /** return this.minLevel < map.minLevel, True mean do not needs load tile data */
    private _isDummy;
    get isDummy(): boolean;
    private _showing;
    /**
     * Gets the showing state of the tile.
     */
    get showing(): boolean;
    /**
     * Sets the showing state of the tile.
     * @param value - The new showing state.
     */
    set showing(value: boolean);
    /** Max height of tile */
    private _maxZ;
    /**
     * Gets the maximum height of the tile.
     */
    get maxZ(): number;
    /**
     * Sets the maximum height of the tile.
     * @param value - The new maximum height.
     */
    protected set maxZ(value: number);
    /** Distance to camera */
    distToCamera: number;
    sizeInWorld: number;
    /**
     * Gets the index of the tile in its parent's children array.
     * @returns The index of the tile.
     */
    get index(): number;
    private _loaded;
    /**
     * Gets the load state of the tile.
     */
    get loaded(): boolean;
    private _inFrustum;
    /** Is tile in frustum ?*/
    get inFrustum(): boolean;
    /**
     * Sets whether the tile is in the frustum.
     * @param value - The new frustum state.
     */
    protected set inFrustum(value: boolean);
    /** Tile is a leaf ?  */
    get isLeaf(): boolean;
    /**
     * Constructor for the Tile class.
     * @param x - Tile X-coordinate, default: 0.
     * @param y - Tile Y-coordinate, default: 0.
     * @param z - Tile level, default: 0.
     */
    constructor(x?: number, y?: number, z?: number);
    /**
     * Override Object3D.traverse, change the callback param type to "this".
     * @param callback - The callback function.
     */
    traverse(callback: (object: this) => void): void;
    /**
     * Override Object3D.traverseVisible, change the callback param type to "this".
     * @param callback - The callback function.
     */
    traverseVisible(callback: (object: this) => void): void;
    /**
     * Override Object3D.raycast, only test the tile has loaded.
     * @param raycaster - The raycaster.
     * @param intersects - The array of intersections.
     */
    raycast(raycaster: Raycaster, intersects: Intersection[]): void;
    /**
     * LOD (Level of Detail).
     * @param loader - The tile loader.
     * @param minLevel - The minimum level.
     * @param maxLevel - The maximum level.
     * @param threshold - The threshold.
     * @returns this
     */
    protected LOD(params: TileUpdateParames): {
        action: LODAction;
        newTiles?: undefined;
    } | {
        action: LODAction;
        newTiles: Tile[];
    };
    /**
     * Checks the visibility of the tile.
     */
    /**
     * Checks the visibility of the tile.
     */
    private _checkVisible;
    /**
     * Asynchronously load tile data
     *
     * @param loader Tile loader
     * @returns this
     */
    private _load;
    /** New tile init */
    private _init;
    /**
     * Updates the tile.
     * @param params - The update parameters.
     * @returns this
     */
    update(params: TileUpdateParames): this;
    private _doAction;
    /**
     * Reloads the tile data.
     * @returns this
     */
    reload(loader: ITileLoader): this;
    /**
     * Checks if the tile is ready to render.
     * @returns this
     */
    private _checkReady;
    /**
     * UnLoads the tile data.
     * @param unLoadSelf - Whether to unload tile itself.
     * @returns this.
     */
    private _unLoad;
}

/**
 * Canvas material laoder abstract base class
 */
export declare abstract class TileCanvasLoader implements ITileMaterialLoader {
    readonly info: {
        version: string;
        description: string;
    };
    dataType: string;
    useWorker: boolean;
    /**
     * Asynchronously load tile material
     * @param params Tile loading parameters
     * @returns Returns the tile material
     */
    load(params: TileSourceLoadParamsType): Promise<TileMaterial>;
    private _creatCanvasContext;
    /**
     * Draw tile on canvas, protected
     * @param ctx Tile canvas context
     * @param params Tile load params
     */
    protected abstract drawTile(ctx: OffscreenCanvasRenderingContext2D, params: TileSourceLoadParamsType): void;
}

/**
 * Inherit of PlaneGeometry, add setData and setDEM method
 */
export declare class TileGeometry extends PlaneGeometry {
    readonly type = "TileGeometry";
    /**
     * set attribute data to geometry
     * @param data geometry data
     * @returns this
     */
    setData(data: GeometryDataType | Float32Array): this;
}

/**
 * Terrain loader base calss
 */
export declare abstract class TileGeometryLoader implements ITileGeometryLoader<TileGeometry> {
    info: ITileLoaderInfo;
    dataType: string;
    useWorker: boolean;
    /**
     * load tile's data from source
     * @param source
     * @param tile
     * @param onError
     * @returns
     */
    load(params: TileSourceLoadParamsType): Promise<TileGeometry>;
    /**
     * Download terrain data
     * @param url url
     */
    protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<TileGeometry>;
}

/**
 * Tile loader
 */
export declare class TileLoader implements ITileLoader {
    private _imgSource;
    /** Get image source */
    get imgSource(): ISource[];
    /** Set image source */
    set imgSource(value: ISource[]);
    private _demSource;
    /** Get DEM source */
    get demSource(): ISource | undefined;
    /** Set DEM source */
    set demSource(value: ISource | undefined);
    private _useWorker;
    /** Get use worker */
    get useWorker(): boolean;
    /** Set use worker */
    set useWorker(value: boolean);
    /** Loader manager */
    manager: TileLoadingManager;
    /**
     * Load getmetry and materail of tile from x, y and z coordinate.
     *
     * @returns Promise<MeshDateType> tile data
     */
    load(params: TileLoadParamsType): Promise<MeshDateType>;
    /**
     * Unload tile mesh data
     * @param tileMesh tile mesh
     */
    unload(tileMesh: Mesh): void;
    /**
     * Load geometry
     * @returns BufferGeometry
     */
    protected loadGeometry(params: TileLoadParamsType): Promise<BufferGeometry>;
    /**
     * Load material
     * @param x x coordinate of tile
     * @param y y coordinate of tile
     * @param z z coordinate of tile
     * @returns Material[]
     */
    protected loadMaterial(params: TileLoadParamsType): Promise<Material[]>;
    /**
     * Check the tile is in the source bounds. (projection coordinate)
     * @returns true in the bounds,else false
     */
    private _isBoundsInSourceBounds;
}

export declare class TileLoadingManager extends LoadingManager {
    onParseEnd?: (url: string) => void;
    parseEnd(url: string): void;
}

/**
 * Tile Load Params Type
 */
export declare type TileLoadParamsType = {
    /** Tile X Coordinate */
    x: number;
    /** Tile Y Coordinate */
    y: number;
    /** Tile Z Coordinate */
    z: number;
    /** Tile projection Bounds */
    bounds: [number, number, number, number];
    /** Tile lonlat Bounds */
    lonLatBounds?: [number, number, number, number];
};

/**
 * Map Mesh
 * 地图模型
 */
export declare class TileMap extends Mesh<BufferGeometry, Material, TileMapEventMap> {
    readonly name = "map";
    private readonly _clock;
    readonly isLOD = true;
    /**
     * Whether the LOD object is updated automatically by the renderer per frame or not.
     * If set to false, you have to call LOD.update() in the render loop by yourself. Default is true.
     * 瓦片是否在每帧渲染时自动更新，默认为真
     */
    autoUpdate: boolean;
    /**
     * Tile tree update interval, unit: ms (default 100ms)
     * 瓦片树更新间隔，单位毫秒（默认100ms）
     */
    updateInterval: number;
    /**
     * Root tile, it is the root node of tile tree.
     * 根瓦片
     */
    readonly rootTile: Tile;
    /**
     * Map data loader, it used for load tile data and create tile geometry/Material
     * 地图数据加载器
     */
    readonly loader: ITileLoader;
    readonly _loader: TileMapLoader;
    private _minLevel;
    /**
     * Get min level of map
     * 地图最小缩放级别，小于这个级别瓦片树不再更新
     */
    get minLevel(): number;
    /**
     * Set max level of map
     * 设置地图最小缩放级别，小于这个级别瓦片树不再更新
     */
    set minLevel(value: number);
    private _maxLevel;
    /**
     * Get max level of map
     * 地图最大缩放级别，大于这个级别瓦片树不再更新
     */
    get maxLevel(): number;
    /**
     * Set max level of map
     * 设置地图最大缩放级别，大于这个级别瓦片树不再更新
     */
    set maxLevel(value: number);
    /**
     * Get central Meridian latidute
     * 取得中央子午线经度
     */
    get lon0(): number;
    /**
     * Set central Meridian latidute, default:0
     * 设置中央子午线经度，中央子午线决定了地图的投影中心经度，可设置为-90，0，90
     */
    set lon0(value: number);
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
    private _imgSource;
    /**
     * Get the image data source object
     * 取得影像数据源
     */
    get imgSource(): ISource[];
    /**
     * Set the image data source object
     * 设置影像数据源
     */
    set imgSource(value: ISource | ISource[]);
    private _demSource;
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
    private _LODThreshold;
    /**
     * Get LOD threshold
     * 取得LOD阈值
     */
    get LODThreshold(): number;
    /**
     * Set LOD threshold
     * 设置LOD阈值，LOD阈值越大，瓦片细化，但耗费资源越高，建议取1-2之间
     */
    set LODThreshold(value: number);
    /** get use worker */
    get useWorker(): boolean;
    /** set use worker */
    set useWorker(value: boolean);
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
     lon0: 90,
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
     * @param params 地图参数 {@link MapParams}
     * @example
     * ``` typescript

     const map = new TileMap({
     // 加载器
     loader: new TileLoader(),
     // 影像数据源
     imgSource: [Source.mapBoxImgSource, new TestSource()],
     // 高程数据源
     demSource: source.mapBoxDemSource,
     // 地图投影中心经度
     lon0: 90,
     // 最小缩放级别
     minLevel: 1,
     // 最大缩放级别
     maxLevel: 18,
     });;
     * ```
     */
    constructor(params: MapParams);
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
     * Geo coordinates converted to map model coordinates
     * 地理坐标转换为地图模型坐标(与geo2map同功能)
     * @param geo 地理坐标（经纬度）
     * @returns 模型坐标
     * @deprecated This method is not recommended. Use geo2map() instead.
     */
    geo2pos(geo: Vector3): Vector3;
    /**
     * Geo coordinates converted to map model coordinates
     * 地理坐标转换为地图模型坐标(与geo2pos同功能)
     * @param geo 地理坐标（经纬度）
     * @returns 模型坐标
     */
    geo2map(geo: Vector3): Vector3;
    /**
     * Geo coordinates converted to world coordinates
     * 地理坐标转换为世界坐标
     *
     * @param geo 地理坐标（经纬度）
     * @returns 世界坐标
     */
    geo2world(geo: Vector3): Vector3;
    /**
     * Map model coordinates converted to geo coordinates
     * 地图模型坐标转换为地理坐标(与map2geo同功能)
     * @param pos 模型坐标
     * @returns 地理坐标（经纬度）
     *  @deprecated This method is not recommended. Use map2geo() instead.
     */
    pos2geo(pos: Vector3): Vector3;
    /**
     * Map model coordinates converted to geo coordinates
     * 地图模型坐标转换为地理坐标(与pos2geo同功能)
     * @param map 模型坐标
     * @returns 地理坐标（经纬度）
     */
    map2geo(pos: Vector3): Vector3;
    /**
     * World coordinates converted to geo coordinates
     * 世界坐标转换为地理坐标
     *
     * @param world 世界坐标
     * @returns 地理坐标（经纬度）
     */
    world2geo(world: Vector3): Vector3;
    /**
     * Get the ground infomation from latitude and longitude
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
     * Get loacation infomation from screen pointer
     * 获取指定屏幕坐标的地面信息
     * @param camera 摄像机
     * @param pointer 点的屏幕坐标（-0.5~0.5）
     * @returns 位置信息（经纬度、高度等）
     */
    getLocalInfoFromScreen(camera: Camera, pointer: Vector2): LocationInfo | undefined;
    /**
     * Get the number of currently downloading tiles
     * 取得当前正在下载的瓦片数量
     */
    get downloading(): number;
    getTileCount(): {
        total: number;
        visible: number;
        leaf: number;
        maxLevel: number;
        downloading: number;
    };
}

/**
 * TileMap Event Map
 * 地图事件
 */
/**
 * Interface representing the event map for a TileMap.
 * Extends the Object3DEventMap interface.
 *
 * @interface TileMapEventMap
 *
 * @property {BaseEvent} ready - Event triggered when the TileMap is ready.
 * @property {BaseEvent & { delta: number }} update - Event triggered when the TileMap is updated.
 *
 * @property {BaseEvent & { tile: Tile }} "tile-created" - Event triggered when a tile is created.
 * @property {BaseEvent & { tile: Tile }} "tile-loaded" - Event triggered when a tile is loaded.
 *
 * @property {BaseEvent & { projection: IProjection }} "projection-changed" -
 *   Event triggered when the projection changes, with the new projection.
 * @property {BaseEvent & { source: ISource | ISource[] | undefined }} "source-changed" -
 *   Event triggered when the source changes, with the new source(s).
 *
 * @property {BaseEvent & { itemsLoaded: number; itemsTotal: number }} "loading-start" -
 *   Event triggered when loading starts, with the number of items loaded and total items.
 * @property {BaseEvent & { url: string }} "loading-error" -
 *   Event triggered when there is a loading error, with the URL of the failed resource.
 * @property {BaseEvent} "loading-complete" -
 *   Event triggered when loading is complete.
 * @property {BaseEvent & { url: string; itemsLoaded: number; itemsTotal: number }} "loading-progress" -
 *   Event triggered during loading progress, with the URL, items loaded, and total items.
 *
 * @property {BaseEvent & { url: string }} "parsing-end" -
 *   Event triggered when parsing ends, with the URL of the parsed resource.
 */
export declare interface TileMapEventMap extends Object3DEventMap {
    ready: BaseEvent;
    update: BaseEvent & {
        delta: number;
    };
    "tile-created": BaseEvent & {
        tile: Tile;
    };
    "tile-loaded": BaseEvent & {
        tile: Tile;
    };
    "tile-unload": BaseEvent & {
        tile: Tile;
    };
    "projection-changed": BaseEvent & {
        projection: IProjection;
    };
    "source-changed": BaseEvent & {
        source: ISource | ISource[] | undefined;
    };
    "loading-start": BaseEvent & {
        itemsLoaded: number;
        itemsTotal: number;
    };
    "loading-error": BaseEvent & {
        url: string;
    };
    "loading-complete": BaseEvent;
    "loading-progress": BaseEvent & {
        url: string;
        itemsLoaded: number;
        itemsTotal: number;
    };
    "parsing-end": BaseEvent & {
        url: string;
    };
}

/** 地图瓦片加载器 */
declare class TileMapLoader extends TileLoader {
    private _projection;
    attcth(loader: ITileLoader, projection: IProjection): void;
    load(params: TileLoadParamsType): Promise<MeshDateType>;
}

/**
 * Tile material
 */
export declare class TileMaterial extends MeshStandardMaterial {
    constructor(params?: MeshStandardMaterialParameters);
    setTexture(texture: Texture): void;
    dispose(): void;
}

/**
 * Image loader base calss
 */
export declare abstract class TileMaterialLoader implements ITileMaterialLoader<ITileMaterial_2> {
    info: {
        version: string;
        description: string;
    };
    dataType: string;
    useWorker: boolean;
    /**
     * Load tile data from source
     * @param source
     * @param tile
     * @returns
     */
    load(params: TileSourceLoadParamsType): Promise<ITileMaterial_2>;
    /**
     * Download terrain data
     * @param url url
     * @returns {Promise<TBuffer>} the buffer of download data
     */
    protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<Texture>;
}

/**
 *  Base class for data sources, users can customize data sources by inheriting this class
 */
export declare class TileSource implements ISource {
    /** Data type that determines which loader to use for loading and processing data. Default is "image" type */
    dataType: string;
    /** Copyright attribution information for the data source, used for displaying map copyright notices */
    attribution: string;
    /** Minimum zoom level supported by the data source. Default is 0 */
    minLevel: number;
    /** Maximum zoom level supported by the data source. Default is 18 */
    maxLevel: number;
    /** Data projection type. Default is "3857" Mercator projection */
    projectionID: ProjectionType;
    /** URL template for tile data. Uses variables like {x},{y},{z} to construct tile request URLs */
    url: string;
    /** List of URL subdomains for load balancing. Can be an array of strings or a single string */
    subdomains: string[] | string;
    /** Currently used subdomain. Randomly selected from subdomains when requesting tiles */
    s: string;
    /** Layer opacity. Range 0-1, default is 1.0 (completely opaque) */
    opacity: number;
    /** Whether to use TMS tile coordinate system. Default false uses XYZ system, true uses TMS system */
    isTMS: boolean;
    /** Data bounds in format [minLon, minLat, maxLon, maxLat]. Default covers global range excluding polar regions */
    bounds: [number, number, number, number];
    /** Projected data bounds */
    _projectionBounds: [number, number, number, number];
    /** User-defined data. Can store any key-value pairs */
    userData: {
        [key: string]: unknown;
    };
    /**
     * constructor
     * @param options SourceOptions
     */
    constructor(options?: SourceOptions);
    /**
     * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
     * @param x tile x coordinate
     * @param y tile y coordinate
     * @param z tile z coordinate
     * @returns url tile url
     */
    getUrl(x: number, y: number, z: number): string | undefined;
    /**
     * Get url from tile coordinate, public，called by TileLoader
     * @param x tile x coordinate
     * @param y tile y coordinate
     * @param z tile z coordinate
     * @returns url tile url
     */
    _getUrl(x: number, y: number, z: number): string | undefined;
    /**
     * Create source directly through factoy functions.
     * @param options source options
     * @returns ISource data source instance
     */
    static create(options: SourceOptions): TileSource;
}

/**
 * Tile Source Load Params Type
 */
export declare type TileSourceLoadParamsType<TSource extends ISource = ISource> = TileLoadParamsType & {
    /** Tile Data Source */
    source: TSource;
};

/**
 * texture loader
 */
export declare class TileTextureLoader {
    private loader;
    /**
     * load the tile texture
     * @param tile tile to load
     * @param source datasource
     * @returns texture
     */
    load(source: ISource, x: number, y: number, z: number): Promise<Texture>;
}

/**
 * Tile update parameters
 */
export declare type TileUpdateParames = {
    camera: Camera;
    loader: ITileLoader;
    minLevel: number;
    maxLevel: number;
    LODThreshold: number;
};

/**
 * Tile event map
 */
export declare interface TTileEventMap extends Object3DEventMap {
    unload: BaseEvent;
    ready: BaseEvent;
    "tile-created": BaseEvent & {
        tile: Tile;
    };
    "tile-loaded": BaseEvent & {
        tile: Tile;
    };
    "tile-unload": BaseEvent & {
        tile: Tile;
    };
}

declare type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

/**
 * 矢量特征值
 */
export declare type VectorFeature = {
    geometry: Point[][];
    properties?: Record<string, unknown>;
    size?: number;
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
 *@description: Vectior tile renderer interface
 *@author: 郭江峰
 *@date: 2023-04-05
 */
/**
 *  瓦片绘图样式，参考leaflet的path样式定义
 */
export declare interface VectorStyle {
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
export declare type VectorStyles = {
    [key: string]: VectorStyle;
};

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

export declare const version: any;

export declare function waitFor(condition: boolean, delay?: number): Promise<void>;

export { }
