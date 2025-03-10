/**
 *@description: Debug material laoder
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { CanvasTexture } from "three";
import { ITileMaterialLoader } from "../../loader/ITileLoaders";
import { TileMaterial } from "../../material";
import { ISource } from "../../source";

/**
 * Debug material laoder, Tt draw a rectangle and coordinate on the tile
 */
export class TileMaterialDebugeLoader implements ITileMaterialLoader {
	public readonly dataType: string = "debug";
	public useWorker = false;
	public discription = "Tile debug image loader. It will draw a rectangle and coordinate on the tile.";

	public async load(source: ISource, x: number, y: number, z: number): Promise<TileMaterial> {
		const texture = new CanvasTexture(this.drawTile(x, y, z));
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
	public drawTile(x: number, y: number, z: number) {
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
			ctx.fillText(`Tile Test - level: ${z}`, size / 2, 50);
			ctx.fillText(`[${x}, ${y}]`, size / 2, 80);
		}
		return canvas.transferToImageBitmap();
	}
}
