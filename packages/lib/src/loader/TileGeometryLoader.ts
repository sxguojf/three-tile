/**
 *@description: Geometry loader abstrace baseclass
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { ITileGeometryLoader, ITileLoaderInfo, TileSourceLoadParamsType } from ".";
import { TileGeometry } from "../geometry";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndBounds } from "./util";

/**
 * Terrain loader base calss
 */
export abstract class TileGeometryLoader implements ITileGeometryLoader<TileGeometry> {
	public info: ITileLoaderInfo = {
		version: "0.11.0",
		description: "Terrain loader base class",
	};

	public dataType = "";

	/**
	 * load tile's data from source
	 * @param source
	 * @param tile
	 * @param onError
	 * @returns
	 */
	public async load(params: TileSourceLoadParamsType): Promise<TileGeometry> {
		const { source, x, y, z } = params;
		const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
		if (!url) {
			return new TileGeometry();
		}
		const geometry = await this.doLoad(url, { source, x, y, z, bounds: clipBounds });
		LoaderFactory.manager.parseEnd(geometry);
		return geometry;
	}

	/**
	 * Download terrain data
	 * @param url url
	 */
	protected abstract doLoad(url: string, params: TileSourceLoadParamsType): Promise<TileGeometry>;
}
