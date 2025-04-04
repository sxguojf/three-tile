/**
 *@description: Debug material laoder
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { TileCanvasLoader } from "three-tile";
/**
 * Debug material laoder, it draw a rectangle and coordinate on the tile
 */
export class TileMaterialDebugeLoader extends TileCanvasLoader {
    /** Loader info */
    info = {
        version: "0.10.0",
        description: "Tile debug image loader. It will draw a rectangle and coordinate on the tile.",
    };
    /** Source data type */
    dataType = "debug";
    /**
     * Draw tile on canvas
     * @param ctx Tile canvas context
     * @param params Tile load params
     */
    drawTile(ctx, params) {
        const { x, y, z, bounds, lonLatBounds } = params;
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
        const centerX = width / 2;
        ctx.font = "14px arial";
        ctx.fillText(`[${bounds[0].toFixed(3)}, ${bounds[1].toFixed(3)}]`, centerX, height - 50);
        ctx.fillText(`[${bounds[2].toFixed(3)}, ${bounds[3].toFixed(3)}]`, centerX, height - 30);
        if (lonLatBounds) {
            // ctx.fillStyle = "red";
            ctx.fillText(`[${lonLatBounds[0].toFixed(3)}, ${lonLatBounds[1].toFixed(3)}]`, centerX, height - 120);
            ctx.fillText(`[${lonLatBounds[2].toFixed(3)}, ${lonLatBounds[3].toFixed(3)}]`, centerX, height - 100);
        }
    }
}
