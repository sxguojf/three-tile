/**
 *@description: Tile Map Mesh 瓦片地图模型
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { Camera, Clock, ColorRepresentation, Intersection, Object3D, Vector2, Vector3 } from "three";
import { BoundsType } from "../loader";
import { ISource } from "../source";
import { Tile } from "../tile";
import { ITileMapLoader } from "./ITileMapLoader";
import { IProjection, ProjectFactory } from "./projection";
import { TileMapEventMap } from "./TileMapEventMap";
import { TileMapLoader } from "./TileMapLoader";
import { attachEvent, getLocalInfoFromScreen, getLocalInfoFromWorld } from "./util";
// import { LayerLoader } from "../layers/LayerLoader";

/** 地面信息类型(经度、纬度、高度) */
export interface LocationInfo extends Intersection {
	location: Vector3;
}

/** 地图中央子午线经度类型 */
type ProjectCenterLongitude = 0 | 90 | -90;

/** 地图创建参数 */
export type MapParams = {
	/** 开启调试模式, debug mode: 0: off, 1... */
	debug?: number;
	/* 地图加载器, map data loader */
	loader?: TileMapLoader;
	/** 跟瓦片 root tile */
	rootTile?: Tile;
	/** 影像数据源, image source */
	imgSource: ISource[] | ISource;
	/** 高程数据源, terrain source */
	demSource?: ISource;
	/**  地图经纬度范围  */
	bounds?: BoundsType;
	/** 地图最小缩放级别, maximum zoom level of the map */
	minLevel?: number;
	/** 中央子午线经度, map centralMeridian longitude */
	lon0?: ProjectCenterLongitude;

	/** @deprecated  背景色，已废弃，使用background插件 */
	backgroundColor?: ColorRepresentation;
	/** @deprecated  地图最大缩放级别，已废弃，自动根据数据源基本设定 */
	maxLevel?: number;
};

/**
 * 瓦片地图模型
 */
export class TileMap extends Object3D<TileMapEventMap> {
	/** 名称 */
	public readonly name = "map";

	/** 调试标志，0：不调试 */
	public debug = 0;

	/** 瓦片树更新时钟 */
	private readonly _mapClock = new Clock();

	/** 是否为LOD模型（LOD模型，当autoUpdate为真时渲染时会自动调用update方法）*/
	public readonly isLOD = true;

	/** 地图是否在每帧渲染时自动更新，默认为真 */
	public autoUpdate = true;

	/** 瓦片树更新间隔，单位毫秒（默认100ms） */
	public updateInterval = 100;

	/** 根瓦片 */
	public readonly rootTile: Tile;

	/** 瓦片数据加载器 */
	public readonly loader: ITileMapLoader;

	private _minLevel = 2;
	/** 取得地图最小缩放级别，小于这个级别瓦片树不再加载数据 */
	public get minLevel() {
		return this._minLevel;
	}
	/** 设置地图最小缩放级别，小于这个级别瓦片树不再加载数据 */
	public set minLevel(value: number) {
		this._minLevel = value;
	}

	private _maxLevel = 20;
	/**  地图最大缩放级别，大于这个级别瓦片树不再更新 */
	public get maxLevel() {
		return this._maxLevel;
	}
	/** @deprecated 废弃，它会自动根据数据源的最大缩放级别设置 */
	public set maxLevel(value: number) {
		this._maxLevel = value;
	}

	/** 取得中央子午线经度 */
	public get lon0() {
		return this.projection.lon0;
	}

	/** 设置中央子午线经度，中央子午线决定了地图的投影中心经度，可设置为-90，0，90，默认为0 */
	public set lon0(value) {
		if (this.projection.lon0 !== value) {
			if (value != 0 && this.minLevel < 1) {
				console.warn(`Map centralMeridian is ${this.lon0}, minLevel must > 0`);
			}
			this.projection = ProjectFactory.createFromID(this.projection.ID, value);
			this._updateSource();
		}
	}

	/** 取得地图投影对象 */
	public get projection(): IProjection {
		return this.loader.projection;
	}

	/** 设置地图投影对象 */
	private set projection(proj: IProjection) {
		if (proj.ID != this.projection.ID || proj.lon0 != this.lon0) {
			this.loader.projection = proj;
			this._resize();
			// 重新加载模型
			this.reload();
			if (this.debug > 0) {
				console.log("Map Projection Changed:", proj.ID, proj.lon0);
			}
			this.dispatchEvent({
				type: "projection-changed",
				projection: proj,
			});
		}
	}

	/** 取得影像数据源 */
	public get imgSource(): ISource[] {
		return this.loader.imgSource;
	}
	/** 设置影像数据源 */
	public set imgSource(value: ISource | ISource[]) {
		const sources = Array.isArray(value) ? value : [value];

		if (sources.length === 0) {
			throw new Error("imgSource can not be empty");
		}

		this.loader.imgSource = sources;

		// 将第一个影像层的投影设置为地图投影
		this.projection = ProjectFactory.createFromID(sources[0].projectionID, this.projection.lon0);

		if (this.debug > 0) {
			console.log("Img Source Changed:", sources);
		}
		this._updateSource();
		this.dispatchEvent({ type: "source-changed", source: value });
	}

	/** 设置地形数据源 */
	public get demSource(): ISource | undefined {
		return this.loader.demSource;
	}

	/** 取得地形数据源 */
	public set demSource(value: ISource | undefined) {
		if (this.loader.demSource === value) {
			return;
		}

		this.loader.demSource = value;

		if (this.debug > 0) {
			console.log("DEM Source Changed:", this.demSource);
		}
		this._updateSource();
		this.dispatchEvent({ type: "source-changed", source: value });
	}

	private _LODThreshold = 1;
	/** 取得LOD阈值	 */
	public get LODThreshold() {
		return this._LODThreshold;
	}
	/** 设置LOD阈值，LOD阈值越大，瓦片细化，但耗费资源越高，建议取1-2之间，默认为1 */
	public set LODThreshold(value) {
		this._LODThreshold = value;
	}

	/** 取得地图经纬度范围 */
	public get bounds() {
		return this.loader.bounds;
	}
	/** 设置地图经纬度范围 */
	public set bounds(value) {
		this.loader.bounds = value;
	}

	/** 取得最大线下载程数 */
	public get maxThreads() {
		return this.loader.maxThreads;
	}

	/** 设置最大线下载程数 */
	public set maxThreads(value: number) {
		this.loader.maxThreads = value;
	}

	/** @deprecated 取得背景色 */
	public get backgroundColor() {
		return 0;
	}
	/** @deprecated 设置背景色 */
	public set backgroundColor(value: ColorRepresentation) {
		value;
	}

	/**
     * 地图创建工厂函数
       @param params 地图参数 {@link MapParams}
       @returns map mesh 地图模型
     */
	public static create(params: MapParams) {
		return new TileMap(params);
	}

	/**
	 * 地图模型构造函数
	 * @param params 地图参数 {@link MapParams}
	 */
	public constructor(params: MapParams) {
		super();
		this.up.set(0, 0, 1);

		const {
			// loader = new LayerLoader(this),
			loader = new TileMapLoader(),
			rootTile = new Tile(),
			minLevel = 2,
			imgSource,
			demSource,
			bounds,
			lon0 = 0,
			debug = 0,
		} = params;

		this.minLevel = minLevel;
		this.loader = loader;
		this.rootTile = rootTile;

		// 地图范围
		bounds && (this.loader.bounds = bounds);
		this.debug = this.loader.debug = debug;
		this.lon0 = lon0;

		// 数据源
		this.imgSource = imgSource;
		this.demSource = demSource;

		// 模型加入地图
		this.add(rootTile);
		// 调整地图大小
		this._resize();

		// 绑定事件
		attachEvent(this);

		// ready
		const onLoadingComplete = () => {
			this.dispatchEvent({ type: "ready" });
			this.removeEventListener("loading-complete", onLoadingComplete);
		};
		this.addEventListener("loading-complete", onLoadingComplete);
	}

	/**
	 * 地图改变大小
	 */
	private _resize() {
		// 拉伸地图到投影大小
		this.rootTile.scale.set(this.projection.mapWidth, this.projection.mapHeight, this.projection.mapDepth);
		// 模型矩阵更新
		this.rootTile.updateMatrix();
		this.rootTile.updateMatrixWorld();
		return this;
	}

	/**
	 * 取得最大缩放级别
	 * @returns 最大缩放级别
	 */
	private _getMaxLevel() {
		let maxLevel = 0;
		this.imgSource.forEach(source => (maxLevel = Math.max(maxLevel, source.maxLevel)));
		if (this.demSource) {
			maxLevel = Math.max(maxLevel, this.demSource.maxLevel);
		}
		if (this.debug) {
			console.log("Max Level:", maxLevel);
		}
		return maxLevel;
	}

	/**
	 * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
	 * @param camera 摄像机
	 */
	public update(camera: Camera) {
		const elapseTime = this._mapClock.getElapsedTime();
		// 控制瓦片树更新速率
		if (elapseTime > this.updateInterval / 1000) {
			this.rootTile.update({
				camera,
				loader: this.loader,
				minLevel: this.minLevel,
				maxLevel: this.maxLevel,
				LODThreshold: this.LODThreshold,
			});
			// shadow
			this.rootTile.castShadow = this.castShadow;
			this.rootTile.receiveShadow = this.receiveShadow;
			this.dispatchEvent({ type: "update", delta: elapseTime });
			this._mapClock.start();
		}
	}

	/**
	 * 更新地图数据
	 */
	private _updateSource() {
		this._maxLevel = this._getMaxLevel();
		this.rootTile.reload(false);
	}

	/**
	 * 销毁全部瓦片并重新加载
	 */
	public reload(dispose = true) {
		this.rootTile.reload(dispose);
	}

	/**
	 * 释放地图资源，并移出场景
	 */
	public dispose() {
		this.removeFromParent();
		this.reload();
	}

	/**
	 * 地理坐标转换为地图模型坐标(与geo2map同功能)
	 * @param geo 地理坐标（经纬度）
	 * @returns 模型坐标
	 * @deprecated 废弃. 请使用 geo2map()
	 */
	public geo2pos(geo: Vector3) {
		return this.geo2map(geo);
	}

	/**
	 * 地理坐标转换为地图模型坐标(与geo2pos同功能)
	 * @param geo 地理坐标（经纬度）
	 * @returns 模型坐标
	 */
	public geo2map(geo: Vector3) {
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
		return this.localToWorld(this.geo2map(geo));
	}

	/**
	 * 地图模型坐标转换为地理坐标(与map2geo同功能)
	 * @param pos 模型坐标
	 * @returns 地理坐标（经纬度）
	 * @deprecated 废弃. 请使用 map2geo()
	 */
	public pos2geo(pos: Vector3) {
		return this.map2geo(pos);
	}
	/**
	 * 地图模型坐标转换为地理坐标(与pos2geo同功能)
	 * @param map 模型坐标
	 * @returns 地理坐标（经纬度）
	 */
	public map2geo(pos: Vector3) {
		const position = this.projection.unProject(pos.x, pos.y);
		return new Vector3(position.lon, position.lat, pos.z);
	}

	/**
	 * 世界坐标转换为地理坐标
	 * @param world 世界坐标
	 * @returns 地理坐标（经纬度）
	 */
	public world2geo(world: Vector3) {
		return this.pos2geo(this.worldToLocal(world.clone()));
	}

	/**
	 * 获取指定经纬度的地面信息（法向量、高度等）
	 * @param geo 地理坐标
	 * @returns 地面信息
	 */
	public getLocalInfoFromGeo(geo: Vector3) {
		const pointer = this.geo2world(geo);
		return getLocalInfoFromWorld(this, pointer);
	}

	/**
	 * 获取指定世界坐标的地面信息
	 * @param pos 世界坐标
	 * @returns 地面信息
	 */
	public getLocalInfoFromWorld(pos: Vector3) {
		return getLocalInfoFromWorld(this, pos);
	}

	/**
	 * 获取指定屏幕坐标的地面信息
	 * @param camera 摄像机
	 * @param pointer 点的屏幕坐标（-0.5~0.5）
	 * @returns 位置信息（经纬度、高度等）
	 */
	public getLocalInfoFromScreen(camera: Camera, pointer: Vector2) {
		return getLocalInfoFromScreen(camera, this, pointer);
	}

	/**
	 * 取得当前正在下载的瓦片数量
	 */
	public get downloading() {
		return this.loader.downloadingThreads;
	}

	/**
	 * 取得地图瓦片状态统计信息
	 */
	public getTileCount() {
		let total = 0,
			visible = 0,
			inFrustum = 0,
			maxLevel = 0,
			leaf = 0,
			downloading = 0;

		this.rootTile.traverse(tile => {
			if (!(tile instanceof Tile)) return;

			total++;
			if (tile.isLeaf) {
				leaf++;
				tile.showing && visible++;
				tile.inFrustum && inFrustum++;
			}
			maxLevel = Math.max(maxLevel, tile.z);
			downloading = this.loader.downloadingThreads;
		});
		return { total, leaf, visible, inFrustum, maxLevel, downloading };
	}
}
