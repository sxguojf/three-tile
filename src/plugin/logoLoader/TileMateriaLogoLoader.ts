/**
 *@description: LOGO loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { CanvasTexture, MeshBasicMaterial } from "three";
import { ITileMaterialLoader } from "../../loader";
import { ISource } from "../../source";

/**
 * LOGO tile Material loader
 */
export class TileMaterialLogoLoader implements ITileMaterialLoader {
	public readonly dataType: string = "logo";
	public description = "Logo Material loader. It will draw logo on the tile.";
	private _texture: CanvasTexture | null = null;
	private _cachedLogo: string | null = null;

	/**
	 * 加载材质
	 * @param source 数据源
	 * @param _y 瓦片的Y坐标
	 * @param _y 瓦片的y坐标
	 * @param z 瓦片的z坐标
	 * @param tile 瓦片
	 * @returns {MeshBasicMaterial} 材质
	 * @param onLoad 加载完成回调
	 * @returns 材质
	 */
	public load(source: ISource, _x: number, _y: number, z: number, onLoad: () => void): MeshBasicMaterial {
		// 瓦片级别<4不绘制logo
		if (z < 4) {
			onLoad();
			return new MeshBasicMaterial();
		}

		// 绘制logo图
		if (!this._texture || this._cachedLogo !== source.attribution) {
			this._texture = new CanvasTexture(this.drawLogo(source.attribution));
			this._texture.needsUpdate = true;
			this._cachedLogo = source.attribution;
		}

		const material = new MeshBasicMaterial({
			transparent: true,
			map: this._texture,
			opacity: source.opacity,
		});

		onLoad();

		return material;
	}

	/**
	 * draw LOGO
	 * @param {string} logo - text
	 * @returns {ImageBitmap} bitmap
	 */
	public drawLogo(logo: string) {
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
			ctx.fillText(`${logo}`, 0, 0);
		}
		return canvas.transferToImageBitmap();
	}
}
