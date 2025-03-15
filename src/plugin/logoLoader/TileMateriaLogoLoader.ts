/**
 *@description: LOGO loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileCanvasLoader } from "../../loader";
import { ISource } from "../../source";

/**
 * LOGO tile Material loader
 */
export class TileMaterialLogoLoader extends TileCanvasLoader {
	public readonly info = {
		description: "Tile debug image loader. It will draw a rectangle and coordinate on the tile.",
	};

	public dataType: string = "logo";

	/**
	 * draw LOGO
	 * @param {string} logo - text
	 * @returns {ImageBitmap} bitmap
	 */
	protected drawTile(
		source: ISource,
		_x: number,
		_y: number,
		_z: number,
		_tileBounds: [number, number, number, number],
	): TexImageSource | OffscreenCanvas {
		const size = 256;
		const canvas = new OffscreenCanvas(size, size);
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.scale(1, -1);
			ctx.translate(0, -size);
			ctx.fillStyle = "white";
			ctx.shadowColor = "black";
			ctx.shadowBlur = 5;
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;
			ctx.font = "bold 14px arial";
			ctx.textAlign = "center";
			ctx.translate(size / 2, size / 2);
			ctx.rotate((30 * Math.PI) / 180);
			ctx.fillText(`${source.attribution}`, 0, 0);
		}
		return canvas.transferToImageBitmap();
	}
}
