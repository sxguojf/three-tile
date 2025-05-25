/**
 *@description: LOGO loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { TileCanvasLoader, TileSourceLoadParamsType } from "three-tile";

/**
 * LOGO tile Material loader
 */
export class TileMaterialLogoLoader extends TileCanvasLoader {
	public readonly info = {
		version: "0.11.2",
		description: "Tile debug image loader. It will draw a rectangle and coordinate on the tile.",
	};

	public dataType: string = "logo";

	/**
	 * Draw tile on canvas
	 * @param ctx Tile canvas context
	 * @param params Tile load params
	 */
	protected drawTile(ctx: OffscreenCanvasRenderingContext2D, params: TileSourceLoadParamsType) {
		ctx.fillStyle = "white";
		ctx.shadowColor = "black";
		ctx.shadowBlur = 5;
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;
		ctx.font = "bold 14px arial";
		ctx.textAlign = "center";
		ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.fillText(`${params.source.attribution}`, 0, 0);
	}
}
