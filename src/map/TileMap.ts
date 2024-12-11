/**
 *@description: Tile Map Mesh 瓦片地图模型
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BaseEvent, BufferGeometry, Camera, Clock, Material, Mesh, Object3DEventMap, Vector2, Vector3 } from "three";
import { ITileLoader, TileLoader } from "../loader";
import { ISource } from "../source";
import { Tile } from "../tile";
import { RootTile } from "../tile/RootTile";
import { SourceWithProjection } from "./SourceWithProjection";
import { IProjection, ProjMCT, ProjectFactory } from "./projection";
import { attachEvent, getAttributions, getLocalInfoFromScreen, getLocalInfoFromWorld, getTileCount } from "./util";

/**
 * TileMap Event Map
 */
export interface TileMapEventMap extends Object3DEventMap {
	ready: BaseEvent;
	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };

	"projection-changed": BaseEvent & { projection: IProjection };
	"source-changed": BaseEvent & { source: ISource | ISource[] | undefined };

	"loading-start": BaseEvent & { itemsLoaded: number; itemsTotal: number };
	"loading-error": BaseEvent & { url: string };
	"loading-complete": BaseEvent;
	"loading-progress": BaseEvent & { url: string; itemsLoaded: number; itemsTotal: number };

	update: BaseEvent & { delta: number };
}

// 地图投影中心经度类型
type ProjectCenterLongitude = 0 | 90 | -90;

/**
 * Type of map create parameters
 * 地图创建参数
 */
export type MapParams = {
	loader?: ITileLoader; //地图加载器, map data loader
	rootTile?: RootTile; //根瓦片, root Tile
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
	// 渲染时钟计时器
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
	 * Root tile, it is the root node of tile tree.
	 * 根瓦片
	 */
	public readonly rootTile: RootTile;

	/**
	 * Map data loader, it used for load tile data and create tile geometry/Material
	 * 地图数据加载器
	 */
	public readonly loader: ITileLoader;

	/**
	 * Get min level of map
	 * 取得地图最小缩放级别，小于这个级别瓦片树不再更新
	 */
	public get minLevel() {
		return this.rootTile.minLevel;
	}
	/**
	 * Set max level of map
	 * 设置地图最小缩放级别，小于这个级别瓦片树不再更新
	 */
	public set minLevel(value: number) {
		this.rootTile.minLevel = value;
	}

	/**
	 * Get max level of map
	 * 取得地图最大缩放级别，大于这个级别瓦片树不再更新
	 */
	public get maxLevel() {
		return this.rootTile.maxLevel;
	}
	/**
	 * Set max level of map
	 * 设置地图最大缩放级别，大于这个级别瓦片树不再更新
	 */
	public set maxLevel(value: number) {
		this.rootTile.maxLevel = value;
	}

	private _autoPosition = false;
	/**
	 * Get whether to adjust z of map automatically.
	 * 取得是否自动根据视野内地形高度调整地图坐标
	 */
	public get autoPosition() {
		return this._autoPosition;
	}
	/**
	 * Set whether to adjust z of map automatically.
	 * 设置是否自动调整地图坐标，如果设置为true，将在每帧渲染中将地图坐标调整可视区域瓦片的平均高度
	 */
	public set autoPosition(value) {
		this._autoPosition = value;
	}

	/**
	 * Get the number of  download cache files.
	 * 取得瓦片下载缓存文件数量。
	 */
	public get loadCacheSize() {
		return this.loader.cacheSize;
	}
	/**
	 * Set the number of  download cache files.
	 * 设置瓦片下载缓存文件数量。使用该属性限制缓存瓦片数量，较大的缓存能加快数据下载速度，但会增加内存使用量，一般取<1000。
	 */
	public set loadCacheSize(value) {
		this.loader.cacheSize = value;
	}

	/**
	 * Get max height in view
	 * 取得可视范围内瓦片的最高高度
	 */
	public get maxZInView() {
		return this.rootTile.maxZ;
	}

	/**
	 * Set min height in view
	 * 取得可视范围内瓦片的最低高度
	 */
	public get minZInView() {
		return this.rootTile.minZ;
	}

	/**
	 * Get avg hegiht in view
	 * 取得可视范围内瓦片的平均高度
	 */
	public get avgZInView() {
		return this.rootTile.avgZ;
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
			if (value != 0 && this.rootTile.minLevel < 1) {
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
		this._projection = proj;
		// 调整根瓦片大小
		this.rootTile.scale.set(proj.mapWidth, proj.mapHeight, proj.mapDepth);
		this.rootTile.isWGS = proj.isWGS;
		this.imgSource.forEach((source) => (source.projection = this.projection));
		if (this.demSource) {
			this.demSource.projection = this.projection;
		}
		if (proj.ID != this.projection.ID && proj.lon0 != this.lon0) {
			this.reload();
			console.log("Map Projection Changed:", proj.ID);
			this.dispatchEvent({
				type: "projection-changed",
				projection: proj,
			});
		}
	}

	private _imgSource: SourceWithProjection[] = [];

	/**
	 * Get the image data source object
	 * 取得影像数据源
	 */
	public get imgSource(): SourceWithProjection[] {
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

		//用代理替换原数据源
		const agentSource = sources.map((source) => {
			if (source instanceof SourceWithProjection) {
				return source;
			} else {
				return new SourceWithProjection(source, this.projection);
			}
		});

		this._imgSource = agentSource;
		this.loader.imgSource = agentSource;

		this.dispatchEvent({ type: "source-changed", source: value });
	}

	private _demSource: SourceWithProjection | undefined;
	/**
	 * Get the terrain data source
	 * 设置地形数据源
	 */
	public get demSource(): SourceWithProjection | undefined {
		return this._demSource;
	}

	/**
	 * Set the terrain data source
	 * 取得地形数据源
	 */
	public set demSource(value: ISource | undefined) {
		if (value) {
			if (value instanceof SourceWithProjection) {
				this._demSource = value;
			} else {
				this._demSource = new SourceWithProjection(value, this.projection);
			}
		} else {
			this._demSource = undefined;
		}
		this.loader.demSource = this._demSource;

		this.dispatchEvent({ type: "source-changed", source: value });
	}

	/**
	 * Get LOD threshold
	 * 取得LOD阈值
	 */
	public get LODThreshold() {
		return this.rootTile.LODThreshold;
	}

	/**
	 * Set LOD threshold
	 * 设置LOD阈值，LOD阈值越大，瓦片细化，但耗费资源越高，建议取1-2之间
	 */
	public set LODThreshold(value) {
		this.rootTile.LODThreshold = value;
	}

	/**
	 * Get the map model width
	 * 取得地图模型宽度
	 */
	// public get width() {
	// 	return this.projection.mapWidth;
	// }

	// /**
	//  * Get the map model height
	//  * 取得地图模型高度
	//  */
	// public get height() {
	// 	return this.projection.mapHeight;
	// }

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
		this.loader = params.loader ?? new TileLoader();
		this.rootTile = params.rootTile ?? new RootTile(this.loader);

		this.minLevel = params.minLevel ?? 1;
		this.maxLevel = params.maxLevel ?? 19;

		this.imgSource = params.imgSource;
		this.demSource = params.demSource;
		this.lon0 = params.lon0 ?? 0;

		// 绑定事件
		attachEvent(this);

		// 模型加入地图
		this.add(this.rootTile);

		// 更新地图模型矩阵
		this.rootTile.updateMatrix();
		this.rootTile.updateMatrixWorld();
	}

	/**
	 * Update the map, It is automatically called after mesh adding a scene
	 * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
	 * @param camera
	 */
	public update(camera: Camera) {
		// for (let i = 0; i < this.minLevel; i++) {
		// 	this.rootTile.material.forEach((mat) => {
		// 		mat.visible = false;
		// 	});
		// }
		this.rootTile.receiveShadow = this.receiveShadow;
		this.rootTile.castShadow = this.castShadow;
		this.rootTile.update(camera);

		// 动态调整地图高度
		if (this.autoPosition) {
			// 平均海拔高度向量
			const hv = this.localToWorld(this.up.clone().multiplyScalar(this.avgZInView));
			// 当前地图高度与平均海拔高度之差，每次移动0.01km
			const dv = this.position.clone().add(hv).multiplyScalar(0.01);
			this.position.sub(dv);
		}

		this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
	}

	/**
	 * reload the map data，muse called after the source has changed
	 * 重新加载地图，在改变地图数据源后调用它才能生效
	 */
	public reload() {
		this.rootTile.dispose(true);
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
	 * 地理坐标转换为地图模型坐标
	 * @param geo 地理坐标（经纬度）
	 * @returns 模型坐标
	 */
	public geo2pos(geo: Vector3) {
		const pos = this.projection.project(geo.x, geo.y);
		return new Vector3(pos.x, pos.y, geo.z);
	}

	/**
	 * 地理坐标转换为世界坐标
	 *
	 * @param geo 地理坐标（经纬度）
	 * @returns 世界坐标
	 */
	public geo2world(geo: Vector3) {
		return this.localToWorld(this.geo2pos(geo));
	}

	/**
	 * Map model coordinates converted to coordinates geo
	 * 地图模型坐标转换为地理坐标
	 * @param pos 模型坐标
	 * @returns 地理坐标（经纬度）
	 */
	public pos2geo(pos: Vector3) {
		const position = this.projection.unProject(pos.x, pos.y);
		return new Vector3(position.lon, position.lat, pos.z);
	}

	/**
	 * 世界坐标转换为地理坐标
	 *
	 * @param world 世界坐标
	 * @returns 地理坐标（经纬度）
	 */
	public world2geo(world: Vector3) {
		return this.pos2geo(this.worldToLocal(world.clone()));
	}

	/**
	 * Get the ground infomation for the specified latitude and longitude
	 * 获取指定经纬度的地面信息（法向量、高度等）
	 * @param geo 地理坐标
	 * @returns 地面信息
	 */
	public getLocalInfoFromGeo(geo: Vector3) {
		const pointer = this.geo2pos(geo);
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
	 * Get loacation infomation from screen point
	 * 获取指定屏幕坐标的地面信息
	 * @param camera 摄像机
	 * @param pointer 点的屏幕坐标（-0.5~0.5）
	 * @returns 位置信息（经纬度、高度等）
	 */
	public getLocalInfoFromScreen(camera: Camera, pointer: Vector2) {
		return getLocalInfoFromScreen(camera, this, pointer);
	}

	/**
	 * Get map data attributions information
	 * 取得地图数据归属版权信息
	 * @returns Attributions 版权信息字符串数组
	 */
	public get attributions() {
		return getAttributions(this);
	}

	/**
	 * Get map tiles statistics to debug
	 * @returns 取得瓦片统计信息，用于调试性能
	 */
	public get tileCount() {
		return getTileCount(this);
	}
}
