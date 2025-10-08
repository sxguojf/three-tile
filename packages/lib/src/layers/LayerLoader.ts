/**
 *@description: 地图瓦片加载器，使用Layer类加载地图瓦片
 *@author: 郭江峰
 */

import { ImageLoader, Material, Mesh, PlaneGeometry } from "three";
import { BoundsType, LoaderFactory, TileCoords, TileLoadingManager, TileMesh } from "../loader";
import { TileMap } from "../map";
import { ITileMapLoader } from "../map/ITileMapLoader";
import { IProjection, ProjMCT } from "../map/projection";
import { ISource } from "../source";
import { Layer } from "./Layer";

/** 地图瓦片加载器，ITileLoader基础上增加地图投影属性 */
export class LayerLoader implements ITileMapLoader {
	downloadingThreads: number = 0;
	maxThreads: number = 10;
	debug: number = 0;
	manager: TileLoadingManager = LoaderFactory.manager;
	layers: Layer[] = [];

	_imageLoader = new ImageLoader(this.manager);

	private _projection: IProjection = new ProjMCT(0);
	public get projection() {
		return this._projection;
	}
	public set projection(projection: IProjection) {
		this._projection = projection;
		// 更新source的投影范围
		this._updateImgProjBounds();
		this._updateDemPrjBounds();
	}
	public get projectionID() {
		return this.map.projection.ID;
	}

	private _imgSource: ISource[] = [];
	public get imgSource() {
		return this._imgSource;
	}

	public set imgSource(source: ISource[]) {
		this._imgSource = source;
		this.layers = [];
		source.forEach(source => {
			this.layers.push(new Layer(this.map, source));
		});
		// 计算source的投影范围
		this._updateImgProjBounds();
	}

	private _demSource: ISource | undefined = undefined;

	public get demSource() {
		return this._demSource;
	}

	public set demSource(source: ISource | undefined) {
		this._demSource = source;
		// 计算source的投影范围
		this._updateDemPrjBounds();
	}

	private _bounds: BoundsType = [-180, -85, 180, 85];
	public set bounds(value: BoundsType) {
		this._bounds = value;
		this._updateImgProjBounds();
		this._updateDemPrjBounds();
	}

	public get bounds(): BoundsType {
		return this._bounds;
	}

	private _updateImgProjBounds() {
		const proj = this.map.projection;
		// 计算数据源投影范围
		this.imgSource.forEach(source => {
			source._projectionBounds = proj.getProjBoundsFromLonLat(source.bounds || this.bounds);
		});
	}

	private _updateDemPrjBounds() {
		const proj = this.map.projection;
		if (this.demSource) {
			// 计算数据源投影范围
			this.demSource._projectionBounds = proj.getProjBoundsFromLonLat(this.demSource.bounds || this.bounds);
		}
	}

	public map: TileMap;

	public constructor(map: TileMap) {
		this.map = map;
	}

	public async load(params: TileCoords): Promise<TileMesh> {
		const { x, y, z, bounds, lonLatBounds } = this._getTileCoords(params);
		const mapProjectionBounds = this.map.projection.getProjBoundsFromLonLat(this.bounds);

		// 不在地图bounds范围，返回空mesh
		if (params.z < this.map.minLevel || !this._intersectsBounds(mapProjectionBounds, bounds)) {
			return new Mesh(new PlaneGeometry(), [new Material()]);
		}

		const geometry = new PlaneGeometry();
		const materials = [];

		const newParams = { x, y, z, bounds, lonLatBounds };

		for (let i = 0; i < this.layers.length; i++) {
			const layer = this.layers[i];
			const material = await layer.load(newParams);
			if (material) {
				materials.push(material);
			}
			geometry.addGroup(0, Infinity, i);
		}
		const mesh = new Mesh(geometry, materials);
		return mesh;
	}

	public async update(coord: TileCoords, tileMesh: TileMesh) {
		const { x, y, z, bounds, lonLatBounds } = this._getTileCoords(coord);
		const geometry = new PlaneGeometry(); //tileMesh.geometry;
		const materials = []; // tileMesh.material;
		geometry.clearGroups();

		const newParams = { x, y, z, bounds, lonLatBounds };

		for (let i = 0; i < this.layers.length; i++) {
			const layer = this.layers[i];
			const material = await layer.load(newParams);
			if (material) {
				materials.push(material);
			}
			geometry.addGroup(0, Infinity, i);
		}
		tileMesh.geometry = geometry;
		tileMesh.material = materials;
	}

	public unload(tileMesh: TileMesh): void {
		const materials = tileMesh.material;
		materials.forEach(mat => mat.dispose());
		tileMesh.geometry.clearGroups();
		tileMesh.geometry.dispose();
	}

	private _getTileCoords(params: TileCoords) {
		const { x, y, z } = params;
		// 计算投影后的瓦片x坐标
		const newX = this.map.projection.getTileXWithCenterLon(x, z);
		// 计算瓦片投影范围
		const bounds = this.map.projection.getProjBoundsFromXYZ(x, y, z);
		// 计算瓦片经纬度范围
		const lonLatBounds = this.map.projection.getLonLatBoundsFromXYZ(x, y, z);

		return { x: newX, y, z, bounds, lonLatBounds };
	}

	private _intersectsBounds(mapBounds: BoundsType, tileBounds: BoundsType): boolean {
		return (
			tileBounds[2] >= mapBounds[0] &&
			tileBounds[3] >= mapBounds[1] &&
			tileBounds[0] <= mapBounds[2] &&
			tileBounds[1] <= mapBounds[3]
		);
	}
}
