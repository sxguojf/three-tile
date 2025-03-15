/**
 *@description: Debug material laoder
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { TileCanvasLoader } from "../../loader/TileCanvasLoader";
import { ISource } from "../../source";

/**
 * Debug material laoder, it draw a rectangle and coordinate on the tile
 */
export class TileMaterialDebugeLoader extends TileCanvasLoader {
	/** Loader info */
	public readonly info = {
		description: "Tile debug image loader. It will draw a rectangle and coordinate on the tile.",
	};

	/** Source data type */
	public readonly dataType = "debug";

	/**
	 * @param source Tile source
	 * @param x Tile x coordinate
	 * @param y Tile y coordinate
	 * @param z Tile z coordinate
	 * @param tileBounds Tile bounds in projection coordinate system. [minX, minY, maxX, maxY]
	 * @returns Canvas
	 */
	protected drawTile(
		_source: ISource,
		x: number,
		y: number,
		z: number,
		tileBounds: [number, number, number, number],
	) {
		const size = 256;
		const canvas = new OffscreenCanvas(size, size);
		const ctx = canvas.getContext("2d")!;
		ctx.scale(1, -1);
		ctx.translate(0, -size);
		if (ctx) {
			ctx.strokeStyle = "#ccc";
			ctx.lineWidth = 4;
			ctx.strokeRect(5, 5, size - 10, size - 10);
			ctx.fillStyle = "white";
			ctx.shadowColor = "black";
			ctx.shadowBlur = 5;
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;
			ctx.font = "bold 20px arial";
			ctx.textAlign = "center";
			ctx.fillText(`Level: ${z}`, size / 2, 50);
			ctx.fillText(`[${x}, ${y}]`, size / 2, 80);

			ctx.font = "16px arial";
			ctx.fillText(`[${tileBounds[0].toFixed(3)}, ${tileBounds[1].toFixed(3)}]`, size / 2, size - 50);
			ctx.fillText(`[${tileBounds[2].toFixed(3)}, ${tileBounds[3].toFixed(3)}]`, size / 2, size - 30);
		}
		return canvas.transferToImageBitmap();
	}
}
