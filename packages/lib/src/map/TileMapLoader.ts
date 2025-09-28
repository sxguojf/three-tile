/**
 *@description: 地图瓦片加载器，完成加载前对瓦片坐标、投影范围的预处理
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BoundsType, TileLoader, TileLoadParamsType, TileMesh } from "../loader";
import { ISource } from "../source";
import { ITileMapLoader } from "./ITileMapLoader";
import { IProjection, ProjMCT } from "./projection";

/** 地图瓦片加载器，ITileLoader基础上增加地图投影属性 */
export class TileMapLoader extends TileLoader implements ITileMapLoader {
	private _projection: IProjection = new ProjMCT(0);

	public override get imgSource() {
		return super.imgSource;
	}

	public override set imgSource(source: ISource[]) {
		super.imgSource = source;
		// 计算source的投影范围
		this._updateImgProjBounds();
	}

	public override get demSource() {
		return super.demSource;
	}

	public override set demSource(source: ISource | undefined) {
		super.demSource = source;
		// 计算source的投影范围
		this._updateDemPrjBounds();
	}

	public override set bounds(value: BoundsType) {
		super.bounds = value;
		this._updateImgProjBounds();
		this._updateDemPrjBounds();
	}

	public override get bounds(): BoundsType {
		return super.bounds;
	}

	private _updateImgProjBounds() {
		const proj = this._projection;
		// 计算数据源投影范围
		this.imgSource.forEach(source => {
			source._projectionBounds = proj.getProjBoundsFromLonLat(source.bounds || this.bounds);
		});
	}

	private _updateDemPrjBounds() {
		const proj = this._projection;
		if (this.demSource) {
			// 计算数据源投影范围
			this.demSource._projectionBounds = proj.getProjBoundsFromLonLat(this.demSource.bounds || this.bounds);
		}
	}

	public get projection() {
		return this._projection;
	}

	public set projection(projection: IProjection) {
		this._projection = projection;
		// 更新source的投影范围
		this._updateImgProjBounds();
		this._updateDemPrjBounds();
	}

	public override async load(params: TileLoadParamsType): Promise<TileMesh> {
		const { x, y, z, bounds, lonLatBounds } = this._getTileCoords(params);
		return super.load({ x, y, z, bounds, lonLatBounds });
	}

	public override async modify(coord: TileLoadParamsType, tileMesh: TileMesh) {
		const { x, y, z, bounds, lonLatBounds } = this._getTileCoords(coord);
		super.modify({ x, y, z, bounds, lonLatBounds }, tileMesh);
	}

	private _getTileCoords(params: TileLoadParamsType) {
		if (!this._projection) {
			throw new Error("projection is undefined");
		}
		const { x, y, z } = params;
		// 计算投影后的瓦片x坐标
		const newX = this._projection.getTileXWithCenterLon(x, z);
		// 计算瓦片投影范围
		const bounds = this._projection.getProjBoundsFromXYZ(x, y, z);
		// 计算瓦片经纬度范围
		const lonLatBounds = this._projection.getLonLatBoundsFromXYZ(x, y, z);

		return { x: newX, y, z, bounds, lonLatBounds };
	}
}
