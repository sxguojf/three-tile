/**
 *@description: Debug material laoder
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { TileCanvasLoader, TileSourceLoadParamsType } from "../../loader";

/**
 * Debug material laoder, it draw a rectangle and coordinate on the tile
 */
export class TileMaterialDebugeLoader extends TileCanvasLoader {
	/** Loader info */
	public readonly info = {
		version: "0.10.0",
		description: "Tile debug image loader. It will draw a rectangle and coordinate on the tile.",
	};

	/** Source data type */
	public readonly dataType = "debug";

	/**
	 * Draw tile on canvas
	 * @param ctx Tile canvas context
	 * @param params Tile load params
	 */
	protected drawTile(ctx: OffscreenCanvasRenderingContext2D, params: TileSourceLoadParamsType) {
		const { x, y, z, bounds } = params;
		const width = ctx.canvas.width;
		const height = ctx.canvas.height;

		ctx.strokeStyle = "#ccc";
		ctx.lineWidth = 4;
		ctx.strokeRect(5, 5, width - 10, height - 10);

		ctx.fillStyle = "white";
		ctx.shadowColor = "black";
		ctx.shadowBlur = 5;
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.font = "bold 20px arial";
		ctx.textAlign = "center";
		ctx.fillText(`Level: ${z}`, width / 2, 50);
		ctx.fillText(`[${x}, ${y}]`, height / 2, 80);

		ctx.font = "16px arial";
		ctx.fillText(`[${bounds[0].toFixed(3)}, ${bounds[1].toFixed(3)}]`, width / 2, width - 50);
		ctx.fillText(`[${bounds[2].toFixed(3)}, ${bounds[3].toFixed(3)}]`, width / 2, height - 30);
	}
}
