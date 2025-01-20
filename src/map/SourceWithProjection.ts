/**
 * 使用代理模式将数据源和投影解耦
 *
 * 地图数据源应该是一个非常简单对象，它主要用来描述瓦片数据的url规则，并保存瓦片元数据，不应该包含太多的逻辑。
 *
 * 但是，由于有地图投影的存在，瓦片xyz规则需要进行一定转换，特别是three-tile存在一个地图投影中心经度的参数，瓦片的xyz更加复杂。
 *
 * 通常情况，将地图投影对象直接传入数据源，并通过投影对象计算瓦片规则，但是这样做数据源类对投影类产生依赖，并且逻辑上数据源不应该知道投影，违反了单一职责原则。
 *
 * 尝试在数据源创建时，给数据源注入瓦片转换规则能够解决，但不够优雅。所以增加了数据源代理。
 *
 * 基本数据源仍为简单对象，在数据源传入地图时，给数据源套上一层代理，代理对象里完成瓦片xyz转换规则，然后再交给原数据源生成url。
 *
 */

import { TileSource, ISource } from "../source";
import { IProjection } from "./projection/IProjection";

/**
 * 地图数据源代理，增加投影功能
 */
export class SourceWithProjection extends TileSource {
	private _source: ISource;

	private _projection!: IProjection;
	public get projection(): IProjection {
		return this._projection;
	}
	public set projection(value: IProjection) {
		this._projection = value;
		this._projectionBounds = this.projection.getPorjBounds(this._source.bounds);
	}

	constructor(source: ISource, projection: IProjection) {
		super();
		Object.assign(this, source);
		this._source = source;
		this.projection = projection;
	}

	public _getTileBounds(x: number, y: number, z: number): [number, number, number, number] {
		return this.projection.getTileBounds(x, y, z);
	}

	/**
	 * 根据给定的瓦片坐标（x, y, z）获取瓦片的URL。
	 *
	 * @param x 瓦片的x坐标。
	 * @param y 瓦片的y坐标。
	 * @param z 瓦片的层级（zoom level）。
	 * @returns 返回瓦片的URL
	 */
	public getUrl(x: number, y: number, z: number): string | undefined {
		// 中心投影后的瓦片x坐标
		const newx = this.projection.getTileXWithCenterLon(x, z);
		return this._source._getTileUrl(newx, y, z);
	}
}
