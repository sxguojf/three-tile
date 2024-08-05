import { TileSource, ISource } from "../source";
import { IProjection } from "./projection/IProjection";

/**
 * 使用代理模式将数据源和投影解耦
 *
 * 地图数据源应该是一个非常简单对象，它主要用来描述瓦片数据的url规则，并保存瓦片元数据，不应该包含太多的逻辑。
 *
 * 但是，由于有地图投影的存在，瓦片xyz规则需要进行一定转换，特别是three-tile存在一个地图投影中心经度的参数，瓦片的xyz更加复杂。
 *
 * 通常情况，将地图投影对象直接传入数据源，并通过投影对象计算瓦片规则，但是这样数据源类对投影类产生依赖，并且逻辑上数据源不应该知道投影，违反了单一职责原则。
 *
 * 尝试在数据源创建时，给数据源注入瓦片转换规则能够解决，但不够优雅。所以增加了数据源代理。
 *
 * 基本数据源仍为简单对象，在数据源传入地图时，给数据源套上一层代理，代理对象里完成瓦片xyz转换规则，然后再交给原数据源生成url。
 *
 */

/**
 * 地图数据源代理，增加投影功能
 * 1. 增加根据投影中心经度，调整瓦片xyz
 * 2. 判断请求的瓦片是否在数据源经纬度有效范围内
 *
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

	// public _projectionBounds!: {
	// 	maxX: number;
	// 	maxY: number;
	// 	minX: number;
	// 	minY: number;
	// };

	private _getTileBounds(x: number, y: number, z: number, s: number = 1) {
		const p1 = this.projection.getTileXYZproj(x, y, z);
		const p2 = this.projection.getTileXYZproj(x + s, y + s, z);
		return {
			minX: Math.min(p1.x, p2.x),
			minY: Math.min(p1.y, p2.y),
			maxX: Math.max(p1.x, p2.x),
			maxY: Math.max(p1.y, p2.y),
		};
	}

	constructor(source: ISource, projection: IProjection) {
		super();
		Object.assign(this, source);
		this._source = source;
		this.projection = projection;
	}

	public getUrl(x: number, y: number, z: number): string | undefined {
		// 计算投影后的xyz
		const n = Math.pow(2, z);
		let newx = x + Math.round((n / 360) * this.projection.lon0);
		if (newx >= n) {
			newx -= n;
		} else if (newx < 0) {
			newx += n;
		}

		// 判断请求的瓦片是否在数据源经纬度有效范围内
		const s = 1;
		const bounds = this._projectionBounds;
		// 取得当前瓦片的bounds
		const tileBounds = this._getTileBounds(newx, y, z, s);

		if (
			tileBounds.maxX < bounds[0] || // minx
			tileBounds.maxY < bounds[1] || // miny
			tileBounds.minX > bounds[2] || // maxx
			tileBounds.minY > bounds[3] // maxy
		) {
			return undefined;
		}

		// if (
		// 	tileBounds.maxX < bounds.minX ||
		// 	tileBounds.minX > bounds.maxX ||
		// 	tileBounds.maxY < bounds.minY ||
		// 	tileBounds.minY > bounds.maxY
		// ) {
		// 	return undefined;
		// }

		return this._source.getTileUrl(newx, y, z);
	}
}
