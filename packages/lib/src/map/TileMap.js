/**
 *@description: Tile Map Mesh 瓦片地图模型
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Clock, Mesh, Vector3 } from "three";
import { TileLoader } from "../loader";
import { Tile } from "../tile";
// import { SourceWithProjection } from "./SourceWithProjection";
import { ProjMCT, ProjectFactory } from "./projection";
import { TileMapLoader } from "./TileMapLoader";
import { attachEvent, getLocalInfoFromScreen, getLocalInfoFromWorld } from "./util";
/**
 * Map Mesh
 * 地图模型
 */
export class TileMap extends Mesh {
    // 名称
    name = "map";
    // 瓦片树更新时钟
    _clock = new Clock();
    // 是否为LOD模型（LOD模型，当autoUpdate为真时渲染时会自动调用update方法）
    isLOD = true;
    /**
     * Whether the LOD object is updated automatically by the renderer per frame or not.
     * If set to false, you have to call LOD.update() in the render loop by yourself. Default is true.
     * 瓦片是否在每帧渲染时自动更新，默认为真
     */
    autoUpdate = true;
    /**
     * Tile tree update interval, unit: ms (default 100ms)
     * 瓦片树更新间隔，单位毫秒（默认100ms）
     */
    updateInterval = 100;
    /**
     * Root tile, it is the root node of tile tree.
     * 根瓦片
     */
    rootTile;
    /**
     * Map data loader, it used for load tile data and create tile geometry/Material
     * 地图数据加载器
     */
    loader;
    _loader = new TileMapLoader();
    _minLevel = 2;
    /**
     * Get min level of map
     * 地图最小缩放级别，小于这个级别瓦片树不再更新
     */
    get minLevel() {
        return this._minLevel;
    }
    /**
     * Set max level of map
     * 设置地图最小缩放级别，小于这个级别瓦片树不再更新
     */
    set minLevel(value) {
        this._minLevel = value;
    }
    _maxLevel = 19;
    /**
     * Get max level of map
     * 地图最大缩放级别，大于这个级别瓦片树不再更新
     */
    get maxLevel() {
        return this._maxLevel;
    }
    /**
     * Set max level of map
     * 设置地图最大缩放级别，大于这个级别瓦片树不再更新
     */
    set maxLevel(value) {
        this._maxLevel = value;
    }
    /**
     * Get central Meridian latidute
     * 取得中央子午线经度
     */
    get lon0() {
        return this.projection.lon0;
    }
    /**
     * Set central Meridian latidute, default:0
     * 设置中央子午线经度，中央子午线决定了地图的投影中心经度，可设置为-90，0，90
     */
    set lon0(value) {
        if (this.projection.lon0 !== value) {
            if (value != 0 && this.minLevel < 1) {
                console.warn(`Map centralMeridian is ${this.lon0}, minLevel must > 0`);
            }
            this.projection = ProjectFactory.createFromID(this.projection.ID, value);
            this.reload();
        }
    }
    _projection = new ProjMCT(0);
    /**
     * Set the map projection object
     * 取得地图投影对象
     */
    get projection() {
        return this._projection;
    }
    /**
     * Get the map projection object
     * 设置地图投影对象
     */
    set projection(proj) {
        if (proj.ID != this.projection.ID || proj.lon0 != this.lon0) {
            this.rootTile.scale.set(proj.mapWidth, proj.mapHeight, proj.mapDepth);
            this._projection = proj;
            this.reload();
            // console.log("Map Projection Changed:", proj.ID, proj.lon0);
            this.dispatchEvent({
                type: "projection-changed",
                projection: proj,
            });
        }
    }
    _imgSource = [];
    /**
     * Get the image data source object
     * 取得影像数据源
     */
    get imgSource() {
        return this._imgSource;
    }
    /**
     * Set the image data source object
     * 设置影像数据源
     */
    set imgSource(value) {
        const sources = Array.isArray(value) ? value : [value];
        if (sources.length === 0) {
            throw new Error("imgSource can not be empty");
        }
        // 将第一个影像层的投影设置为地图投影
        this.projection = ProjectFactory.createFromID(sources[0].projectionID, this.projection.lon0);
        this._imgSource = sources;
        this.loader.imgSource = sources;
        this.dispatchEvent({ type: "source-changed", source: value });
    }
    _demSource;
    /**
     * Get the terrain data source
     * 设置地形数据源
     */
    get demSource() {
        return this._demSource;
    }
    /**
     * Set the terrain data source
     * 取得地形数据源
     */
    set demSource(value) {
        this._demSource = value;
        this.loader.demSource = this._demSource;
        this.dispatchEvent({ type: "source-changed", source: value });
    }
    _LODThreshold = 1;
    /**
     * Get LOD threshold
     * 取得LOD阈值
     */
    get LODThreshold() {
        return this._LODThreshold;
    }
    /**
     * Set LOD threshold
     * 设置LOD阈值，LOD阈值越大，瓦片细化，但耗费资源越高，建议取1-2之间
     */
    set LODThreshold(value) {
        this._LODThreshold = value;
    }
    /** get use worker */
    get useWorker() {
        return this.loader.useWorker;
    }
    /** set use worker */
    set useWorker(value) {
        this.loader.useWorker = value;
    }
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
    static create(params) {
        return new TileMap(params);
    }
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
    constructor(params) {
        super();
        this.up.set(0, 0, 1);
        const { loader = new TileLoader(), rootTile = new Tile(), minLevel = 2, maxLevel = 19, imgSource, demSource, lon0 = 0, } = params;
        this.loader = loader;
        rootTile.matrixAutoUpdate = true;
        rootTile.scale.set(this.projection.mapWidth, this.projection.mapHeight, this.projection.mapDepth);
        this.rootTile = rootTile;
        this.minLevel = minLevel;
        this.maxLevel = maxLevel;
        this.imgSource = imgSource;
        this.demSource = demSource;
        this.lon0 = lon0;
        // 模型加入地图
        this.add(rootTile);
        // 更新地图模型矩阵
        rootTile.updateMatrix();
        // 绑定事件
        attachEvent(this);
    }
    /**
     * Update the map, It is automatically called after mesh adding a scene
     * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
     * @param camera
     */
    update(camera) {
        const elapseTime = this._clock.getElapsedTime();
        // 控制瓦片树更新速率
        if (elapseTime > this.updateInterval / 1000) {
            this._loader.attcth(this.loader, this.projection);
            try {
                this.rootTile.update({
                    camera,
                    loader: this._loader,
                    minLevel: this.minLevel,
                    maxLevel: this.maxLevel,
                    LODThreshold: this.LODThreshold,
                });
                // shadow
                this.rootTile.castShadow = this.castShadow;
                this.rootTile.receiveShadow = this.receiveShadow;
            }
            catch (e) {
                console.error("Error on loading tile data.", e);
            }
            this._clock.start();
            this.dispatchEvent({ type: "update", delta: elapseTime });
        }
        // 动态调整地图高度
        // if (this.autoPosition) {
        // 	// 平均海拔高度向量
        // 	const hv = this.localToWorld(this.up.clone().multiplyScalar(this.avgZInView));
        // 	// 当前地图高度与平均海拔高度之差，每次移动0.01km
        // 	const dv = this.position.clone().add(hv).multiplyScalar(0.01);
        // 	this.position.sub(dv);
        // }
    }
    /**
     * reload the map data，muse called after the source has changed
     * 重新加载地图，在改变地图数据源后调用它才能生效
     */
    reload() {
        this.rootTile.reload(this.loader);
    }
    /**
     * dispose map.
     * todo: remve event.
     * 释放地图资源，并移出场景
     */
    dispose() {
        this.removeFromParent();
        this.reload();
    }
    /**
     * Geo coordinates converted to map model coordinates
     * 地理坐标转换为地图模型坐标(与geo2map同功能)
     * @param geo 地理坐标（经纬度）
     * @returns 模型坐标
     * @deprecated This method is not recommended. Use geo2map() instead.
     */
    geo2pos(geo) {
        return this.geo2map(geo);
    }
    /**
     * Geo coordinates converted to map model coordinates
     * 地理坐标转换为地图模型坐标(与geo2pos同功能)
     * @param geo 地理坐标（经纬度）
     * @returns 模型坐标
     */
    geo2map(geo) {
        const pos = this.projection.project(geo.x, geo.y);
        return new Vector3(pos.x, pos.y, geo.z);
    }
    /**
     * Geo coordinates converted to world coordinates
     * 地理坐标转换为世界坐标
     *
     * @param geo 地理坐标（经纬度）
     * @returns 世界坐标
     */
    geo2world(geo) {
        return this.localToWorld(this.geo2pos(geo));
    }
    /**
     * Map model coordinates converted to geo coordinates
     * 地图模型坐标转换为地理坐标(与map2geo同功能)
     * @param pos 模型坐标
     * @returns 地理坐标（经纬度）
     *  @deprecated This method is not recommended. Use map2geo() instead.
     */
    pos2geo(pos) {
        return this.map2geo(pos);
    }
    /**
     * Map model coordinates converted to geo coordinates
     * 地图模型坐标转换为地理坐标(与pos2geo同功能)
     * @param map 模型坐标
     * @returns 地理坐标（经纬度）
     */
    map2geo(pos) {
        const position = this.projection.unProject(pos.x, pos.y);
        return new Vector3(position.lon, position.lat, pos.z);
    }
    /**
     * World coordinates converted to geo coordinates
     * 世界坐标转换为地理坐标
     *
     * @param world 世界坐标
     * @returns 地理坐标（经纬度）
     */
    world2geo(world) {
        return this.pos2geo(this.worldToLocal(world.clone()));
    }
    /**
     * Get the ground infomation from latitude and longitude
     * 获取指定经纬度的地面信息（法向量、高度等）
     * @param geo 地理坐标
     * @returns 地面信息
     */
    getLocalInfoFromGeo(geo) {
        const pointer = this.geo2world(geo);
        return getLocalInfoFromWorld(this, pointer);
    }
    /**
     * Get loacation infomation from world position
     * 获取指定世界坐标的地面信息
     * @param pos 世界坐标
     * @returns 地面信息
     */
    getLocalInfoFromWorld(pos) {
        return getLocalInfoFromWorld(this, pos);
    }
    /**
     * Get loacation infomation from screen pointer
     * 获取指定屏幕坐标的地面信息
     * @param camera 摄像机
     * @param pointer 点的屏幕坐标（-0.5~0.5）
     * @returns 位置信息（经纬度、高度等）
     */
    getLocalInfoFromScreen(camera, pointer) {
        return getLocalInfoFromScreen(camera, this, pointer);
    }
    /**
     * Get the number of currently downloading tiles
     * 取得当前正在下载的瓦片数量
     */
    get downloading() {
        return Tile.downloadThreads;
    }
    getTileCount() {
        let total = 0, visible = 0, maxLevel = 0, leaf = 0, downloading = 0;
        this.rootTile.traverse(tile => {
            if (!tile.isTile)
                return;
            total++;
            if (tile.isLeaf) {
                leaf++;
                if (tile.inFrustum)
                    visible++;
            }
            maxLevel = Math.max(maxLevel, tile.z);
            downloading = Tile.downloadThreads;
        });
        return { total, visible, leaf, maxLevel: maxLevel, downloading: downloading };
    }
}
