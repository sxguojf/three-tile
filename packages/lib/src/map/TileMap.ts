/**
 *@description: Tile Map Mesh 瓦片地图模型
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BaseEvent, BufferGeometry, Camera, Clock, Material, Mesh, Object3DEventMap, Vector2, Vector3 } from "three";
import { ITileGeometryLoader, ITileLoader, ITileMaterialLoader, LoaderFactory, TileLoader } from "../loader";
import { ISource } from "../source";
import { Tile } from "../tile";
// import { SourceWithProjection } from "./SourceWithProjection";
import { IProjection, ProjMCT, ProjectFactory } from "./projection";
import { attachEvent, getLocalInfoFromScreen, getLocalInfoFromWorld } from "./util";
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
 * @property {BaseEvent & { delta: number }} update - Event triggered when the TileMap is updated, with a delta value.
 *
 * @property {BaseEvent & { tile: Tile }} "tile-created" - Event triggered when a tile is created, with the created tile.
 * @property {BaseEvent & { tile: Tile }} "tile-loaded" - Event triggered when a tile is loaded, with the loaded tile.
 *
 * @property {BaseEvent & { projection: IProjection }} "projection-changed" - Event triggered when the projection changes, with the new projection.
 * @property {BaseEvent & { source: ISource | ISource[] | undefined }} "source-changed" - Event triggered when the source changes, with the new source(s).
 *
 * @property {BaseEvent & { itemsLoaded: number; itemsTotal: number }} "loading-start" - Event triggered when loading starts, with the number of items loaded and total items.
 * @property {BaseEvent & { url: string }} "loading-error" - Event triggered when there is a loading error, with the URL of the failed resource.
 * @property {BaseEvent} "loading-complete" - Event triggered when loading is complete.
 * @property {BaseEvent & { url: string; itemsLoaded: number; itemsTotal: number }} "loading-progress" - Event triggered during loading progress, with the URL, items loaded, and total items.
 *
 * @property {BaseEvent & { url: string }} "parsing-end" - Event triggered when parsing ends, with the URL of the parsed resource.
 */
export interface TileMapEventMap extends Object3DEventMap {
	ready: BaseEvent;
	update: BaseEvent & { delta: number };

	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };
	"tile-dispose": BaseEvent & { tile: Tile };

	"projection-changed": BaseEvent & { projection: IProjection };
	"source-changed": BaseEvent & { source: ISource | ISource[] | undefined };

	"loading-start": BaseEvent & { itemsLoaded: number; itemsTotal: number };
	"loading-error": BaseEvent & { url: string };
	"loading-complete": BaseEvent;
	"loading-progress": BaseEvent & { url: string; itemsLoaded: number; itemsTotal: number };

	"parsing-end": BaseEvent & { url: string };
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
	loader?: ITileLoader; //地图加载器, map data loader
	rootTile?: Tile; //根瓦片, root Tile
	imgSource: ISource[] | ISource; //影像数据源, image source
	demSource?: ISource; //高程数据源, terrain source
	minLevel?: number; //最小缩放级别, maximum zoom level of the map
	maxLevel?: number; //最大缩放级别, minimum zoom level for the map
	lon0?: ProjectCenterLongitude; //投影中心经度, map centralMeridian longitude
};

/**
 * Map Mesh
 * 地图模型
 */

export class TileMap extends Mesh<BufferGeometry, Material, TileMapEventMap> {
	// 名称
	public readonly name = "map";
	// 瓦片树更新时钟
	private readonly _clock = new Clock();

	// 是否为LOD模型（LOD模型，当autoUpdate为真时渲染时会自动调用update方法）
	public readonly isLOD = true;
	/**
	 * Whether the LOD object is updated automatically by the renderer per frame or not.
	 * If set to false, you have to call LOD.update() in the render loop by yourself. Default is true.
	 * 瓦片是否在每帧渲染时自动更新，默认为真
	 */
	public autoUpdate = true;

	/**
	 * Tile tree update interval, unit: ms (default 100ms)
	 * 瓦片树更新间隔，单位毫秒（默认100ms）
	 */
	public updateInterval = 100;

	/**
	 * Root tile, it is the root node of tile tree.
	 * 根瓦片
	 */
	public readonly rootTile: Tile;

	/**
	 * Map data loader, it used for load tile data and create tile geometry/Material
	 * 地图数据加载器
	 */
	public readonly loader: ITileLoader;
	public readonly _loader = new TileMapLoader();

	private _minLevel = 2;
	/**
	 * Get min level of map
	 * 地图最小缩放级别，小于这个级别瓦片树不再更新
	 */
	public get minLevel() {
		return this._minLevel;
	}
	/**
	 * Set max level of map
	 * 设置地图最小缩放级别，小于这个级别瓦片树不再更新
	 */
	public set minLevel(value: number) {
		this._minLevel = value;
	}

	private _maxLevel = 19;
	/**
	 * Get max level of map
	 * 地图最大缩放级别，大于这个级别瓦片树不再更新
	 */
	public get maxLevel() {
		return this._maxLevel;
	}
	/**
	 * Set max level of map
	 * 设置地图最大缩放级别，大于这个级别瓦片树不再更新
	 */
	public set maxLevel(value: number) {
		this._maxLevel = value;
	}

	/**
	 * Get central Meridian latidute
	 * 取得中央子午线经度
	 */
	public get lon0() {
		return this.projection.lon0;
	}

	/**
	 * Set central Meridian latidute, default:0
	 * 设置中央子午线经度，中央子午线决定了地图的投影中心经度，可设置为-90，0，90
	 */
	public set lon0(value) {
		if (this.projection.lon0 !== value) {
			if (value != 0 && this.minLevel < 1) {
				console.warn(`Map centralMeridian is ${this.lon0}, minLevel must > 0`);
			}
			this.projection = ProjectFactory.createFromID(this.projection.ID, value);
			this.reload();
		}
	}

	private _projection: IProjection = new ProjMCT(0);

	/**
	 * Set the map projection object
	 * 取得地图投影对象
	 */
	public get projection(): IProjection {
		return this._projection;
	}

	/**
	 * Get the map projection object
	 * 设置地图投影对象
	 */
	private set projection(proj: IProjection) {
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

	private _imgSource: ISource[] = [];

	/**
	 * Get the image data source object
	 * 取得影像数据源
	 */
	public get imgSource(): ISource[] {
		return this._imgSource;
	}

	/**
	 * Set the image data source object
	 * 设置影像数据源
	 */
	public set imgSource(value: ISource | ISource[]) {
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

	private _demSource: ISource | undefined;
	/**
	 * Get the terrain data source
	 * 设置地形数据源
	 */
	public get demSource(): ISource | undefined {
		return this._demSource;
	}

	/**
	 * Set the terrain data source
	 * 取得地形数据源
	 */
	public set demSource(value: ISource | undefined) {
		this._demSource = value;
		this.loader.demSource = this._demSource;
		this.dispatchEvent({ type: "source-changed", source: value });
	}

	private _LODThreshold = 1;

	/**
	 * Get LOD threshold
	 * 取得LOD阈值
	 */
	public get LODThreshold() {
		return this._LODThreshold;
	}

	/**
	 * Set LOD threshold
	 * 设置LOD阈值，LOD阈值越大，瓦片细化，但耗费资源越高，建议取1-2之间
	 */
	public set LODThreshold(value) {
		this._LODThreshold = value;
	}

	/** get use worker */
	public get useWorker() {
		return this.loader.useWorker;
	}
	/** set use worker */
	public set useWorker(value: boolean) {
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
	public static create(params: MapParams) {
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
	public constructor(params: MapParams) {
		super();
		this.up.set(0, 0, 1);
		const {
			loader = new TileLoader(),
			rootTile = new Tile(),
			minLevel = 2,
			maxLevel = 19,
			imgSource,
			demSource,
			lon0 = 0,
		} = params;

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
	public update(camera: Camera) {
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
			} catch (e) {
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
	public reload() {
		this.rootTile.reload();
	}

	/**
	 * dispose map.
	 * todo: remve event.
	 * 释放地图资源，并移出场景
	 */
	public dispose() {
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
	public geo2pos(geo: Vector3) {
		return this.geo2map(geo);
	}

	/**
	 * Geo coordinates converted to map model coordinates
	 * 地理坐标转换为地图模型坐标(与geo2pos同功能)
	 * @param geo 地理坐标（经纬度）
	 * @returns 模型坐标
	 */
	public geo2map(geo: Vector3) {
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
	public geo2world(geo: Vector3) {
		return this.localToWorld(this.geo2pos(geo));
	}

	/**
	 * Map model coordinates converted to geo coordinates
	 * 地图模型坐标转换为地理坐标(与map2geo同功能)
	 * @param pos 模型坐标
	 * @returns 地理坐标（经纬度）
	 *  @deprecated This method is not recommended. Use map2geo() instead.
	 */
	public pos2geo(pos: Vector3) {
		return this.map2geo(pos);
	}
	/**
	 * Map model coordinates converted to geo coordinates
	 * 地图模型坐标转换为地理坐标(与pos2geo同功能)
	 * @param map 模型坐标
	 * @returns 地理坐标（经纬度）
	 */
	public map2geo(pos: Vector3) {
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
	public world2geo(world: Vector3) {
		return this.pos2geo(this.worldToLocal(world.clone()));
	}

	/**
	 * Get the ground infomation from latitude and longitude
	 * 获取指定经纬度的地面信息（法向量、高度等）
	 * @param geo 地理坐标
	 * @returns 地面信息
	 */
	public getLocalInfoFromGeo(geo: Vector3) {
		const pointer = this.geo2world(geo);
		return getLocalInfoFromWorld(this, pointer);
	}

	/**
	 * Get loacation infomation from world position
	 * 获取指定世界坐标的地面信息
	 * @param pos 世界坐标
	 * @returns 地面信息
	 */
	public getLocalInfoFromWorld(pos: Vector3) {
		return getLocalInfoFromWorld(this, pos);
	}

	/**
	 * Get loacation infomation from screen pointer
	 * 获取指定屏幕坐标的地面信息
	 * @param camera 摄像机
	 * @param pointer 点的屏幕坐标（-0.5~0.5）
	 * @returns 位置信息（经纬度、高度等）
	 */
	public getLocalInfoFromScreen(camera: Camera, pointer: Vector2) {
		return getLocalInfoFromScreen(camera, this, pointer);
	}

	/**
	 * Get the number of currently downloading tiles
	 * 取得当前正在下载的瓦片数量
	 */
	public get downloading() {
		return Tile.downloadThreads;
	}

	public static get loaderInfo() {
		return LoaderFactory.getLoadersInfo();
	}
	public static registerImgLoader(loader: ITileMaterialLoader) {
		LoaderFactory.registerMaterialLoader(loader);
		return loader;
	}

	public static registerDEMloader(loader: ITileGeometryLoader) {
		LoaderFactory.registerGeometryLoader(loader);
		return loader;
	}
}
