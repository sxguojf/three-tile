/**
 *@description: Canvas material laoder
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { CanvasTexture } from "three";
import { TileMaterial } from "../material";
/**
 * Canvas material laoder abstract base class
 */
export class TileCanvasLoader {
    info = {
        version: "0.10.0",
        description: "Canvas tile abstract loader",
    };
    dataType = "";
    useWorker = false;
    /**
     * Asynchronously load tile material
     * @param params Tile loading parameters
     * @returns Returns the tile material
     */
    async load(params) {
        const ctx = this._creatCanvasContext(256, 256);
        this.drawTile(ctx, params);
        const texture = new CanvasTexture(ctx.canvas.transferToImageBitmap());
        const material = new TileMaterial({
            transparent: true,
            map: texture,
            opacity: params.source.opacity,
        });
        return material;
    }
    _creatCanvasContext(width, height) {
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("create canvas context failed");
        }
        ctx.scale(1, -1);
        ctx.translate(0, -height);
        return ctx;
    }
}
