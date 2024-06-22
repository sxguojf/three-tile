import { BaseSource, ISource } from "../source";
import { IProjection } from "./projection/IProjection";

/**
 * 使用代理模式解耦
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
export class SourceAgent extends BaseSource {
	private _source: ISource;

	// _XYZPreset?: (x: number, y: number, z: number) => { x: number; y: number; z: number } | undefined;
	// _ProjectionBounds?: { minX: number; minY: number; maxX: number; maxY: number } | undefined;

	private _projection: IProjection;
	public get projection(): IProjection {
		return this._projection;
	}
	public set projection(value: IProjection) {
		this._projection = value;
	}

	// private _bounds: {
	// 	maxX: number;
	// 	maxY: number;
	// 	minX: number;
	// 	minY: number;
	// };

	constructor(source: ISource, projection: IProjection) {
		super();
		Object.assign(this, source);
		this._source = source;
		this._projection = projection;
		// this._bounds = projection.getPorjBounds(source.bounds);
	}

	public getUrl(x: number, y: number, z: number): string | undefined {
		// 计算投影后的xyz
		const n = Math.pow(2, z);
		let newx = x + Math.round((n / 360) * this.projection.centralMeridian);
		if (newx >= n) {
			newx -= n;
		} else if (newx < 0) {
			newx += n;
		}
		return this._source.getTileUrl(newx, y, z);
	}
}

// private _tileXYZPreset() {
// 	const preset = (source: ISource, x: number, y: number, z: number) => {
// 		let bounds = source._ProjectionBounds;
// 		if (!bounds) {
// 			bounds = this.projection.getPorjBounds(source.bounds);
// 			source._ProjectionBounds = bounds;
// 		}
// 		const offset = 0.9;
// 		const xyzMin = this.projection.tileXYZ2proj(x + offset, y - offset, z);
// 		const xyzMax = this.projection.tileXYZ2proj(x - offset, y + offset, z);
// 		if (xyzMin.x < bounds.minX || xyzMax.x > bounds.maxX || xyzMin.y < bounds.minY || xyzMax.y > bounds.maxY) {
// 			return undefined;
// 		}
// 		return { x: this.projection.getProjTileX(x, z), y, z };
// 	};

// 	this.loader.imgSource.forEach((source) => {
// 		if (!source._XYZPreset) {
// 			source._XYZPreset = (x: number, y: number, z: number) => {
// 				return preset(source, x, y, z);
// 			};
// 		}
// 	});
// 	if (this.loader.demSource) {
// 		const source = this.loader.demSource;
// 		this.loader.demSource._XYZPreset = (x: number, y: number, z: number) => {
// 			return preset(source, x, y, z);
// 		};
// 	}
// }
