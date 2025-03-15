/**
 *@description: Debug material laoder
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { CanvasTexture } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from "../loader";
import { ISource } from "../source";
import { TileMaterial } from "../material";

/**
 * Canvas material laoder abstract base class
 */
export abstract class TileCanvasLoader implements ITileMaterialLoader {
	public readonly info = {
		description: "Canvas tile abstract loader",
	};

	public dataType = "";
	public useWorker = false;

	public async load(params: TileSourceLoadParamsType): Promise<TileMaterial> {
		const { source, x, y, z, bounds: tileBounds } = params;
		const texture = new CanvasTexture(this.drawTile(source, x, y, z, tileBounds));
		texture.needsUpdate = true;
		const material = new TileMaterial({
			transparent: true,
			map: texture,
			opacity: source.opacity,
		});
		return material;
	}

	/**
	 * draw a box and coordiante
	 * @param tile
	 * @returns bitmap
	 */
	protected abstract drawTile(
		source: ISource,
		x: number,
		y: number,
		z: number,
		tileBounds: [number, number, number, number],
	): TexImageSource | OffscreenCanvas;
}
