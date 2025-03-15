/**
 *@description: 地图瓦片加载器，完成加载前对瓦片坐标、投影范围的预处理
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { ITileLoader, MeshDateType, TileLoader, TileLoadParamsType } from "../loader";
import { IProjection } from "./projection";

/** 地图瓦片加载器 */
export class TileMapLoader extends TileLoader {
	private _projection: IProjection | undefined;

	public attcth(loader: ITileLoader, projection: IProjection) {
		Object.assign(this, loader);
		this._projection = projection;
		const imgSource = loader.imgSource;
		const demSource = loader.demSource;
		// 计算数据源投影范围
		imgSource.forEach((source) => {
			source._projectionBounds = projection.getProjBounds(source.bounds);
		});
		if (demSource) {
			demSource._projectionBounds = this._projection.getProjBounds(demSource.bounds);
		}
	}

	public async load(params: TileLoadParamsType): Promise<MeshDateType> {
		if (!this._projection) {
			throw new Error("projection is undefined");
		}
		const { x, y, z } = params;
		// 计算投影后的瓦片x坐标
		const newX = this._projection.getTileXWithCenterLon(x, z);
		// 计算瓦片投影范围
		const bounds = this._projection.getTileBounds(x, y, z);
		return super.load({ x: newX, y, z, bounds });
	}
}
