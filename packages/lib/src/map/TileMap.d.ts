/**
 *@description: Tile Map Mesh 瓦片地图模型
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { BaseEvent, BufferGeometry, Camera, Material, Mesh, Object3DEventMap, Vector2, Vector3 } from "three";
import { ITileLoader } from "../loader";
import { ISource } from "../source";
import { Tile } from "../tile";
import { IProjection } from "./projection";
import { TileMapLoader } from "./TileMapLoader";
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
export interface TileMapEventMap extends Object3DEventMap {
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
/**
 * Map projection center longitude type
 * 地图投影中心经度类型
 */
type ProjectCenterLongitude = 0 | 90 | -90;
/**
 * Type of map create parameters
 * 地图创建参数
 */
export type MapParams = {
    loader?: ITileLoader;
    rootTile?: Tile;
    imgSource: ISource[] | ISource;
    demSource?: ISource;
    minLevel?: number;
    maxLevel?: number;
    lon0?: ProjectCenterLongitude;
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
    getLocalInfoFromGeo(geo: Vector3): import("./util").LocationInfo | undefined;
    /**
     * Get loacation infomation from world position
     * 获取指定世界坐标的地面信息
     * @param pos 世界坐标
     * @returns 地面信息
     */
    getLocalInfoFromWorld(pos: Vector3): import("./util").LocationInfo | undefined;
    /**
     * Get loacation infomation from screen pointer
     * 获取指定屏幕坐标的地面信息
     * @param camera 摄像机
     * @param pointer 点的屏幕坐标（-0.5~0.5）
     * @returns 位置信息（经纬度、高度等）
     */
    getLocalInfoFromScreen(camera: Camera, pointer: Vector2): import("./util").LocationInfo | undefined;
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
export {};
