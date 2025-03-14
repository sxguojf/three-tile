import { ITileLoader, MeshDateType, TileLoader } from "../loader";
import { IProjection } from "./projection";

/** 地图瓦片加载器 */
export class TileMapLoader extends TileLoader {
	private _loader: ITileLoader;
	private _projection: IProjection;

	constructor(loader: ITileLoader, projection: IProjection) {
		super();
		this._loader = loader;
		this._projection = projection;
		Object.assign(this, loader);
	}

	public async load(x: number, y: number, z: number): Promise<MeshDateType> {
		const imgSource = this._loader.imgSource;
		const demSource = this._loader.demSource;
		imgSource.forEach((source) => {
			source._projectionBounds = this._projection.getProjBounds(source.bounds);
		});
		if (demSource) {
			demSource._projectionBounds = this._projection.getProjBounds(demSource.bounds);
		}

		const projX = this._projection.getTileXWithCenterLon(x, z);
		const tileBounds = this._projection.getTileBounds(x, y, z);
		return super.load(projX, y, z, tileBounds);
	}
}
