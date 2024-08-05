import { MeshBasicMaterial, Texture as CanvasTexture } from "three";
import { ISource } from "../../source";
import { ITileMaterialLoader } from "../../loader";
import { Tile } from "../../tile";

/**
 * LOGO tile Material loader
 */
export class TileMaterialLogoLoader implements ITileMaterialLoader {
	public readonly dataType: string = "logo";
	private _texture: CanvasTexture | null = null; // = new CanvasTexture(this.drawLogo(source.attribution));

	/**
	 * 加载材质
	 * @param source 数据源
	 * @param tile 瓦片
	 * @param onLoad 加载完成回调
	 * @returns 材质
	 */
	public load(source: ISource, tile: Tile, onLoad: () => void, _onError: (err: any) => void): MeshBasicMaterial {
		// 瓦片级别<4不绘制logo
		if (tile.coord.z < 4) {
			setTimeout(onLoad);
			return new MeshBasicMaterial();
		}

		// 绘制logo图
		if (!this._texture) {
			this._texture = new CanvasTexture(this.drawLogo(source.attribution));
			this._texture.needsUpdate = true;
		}

		const material = new MeshBasicMaterial({
			transparent: true,
			map: this._texture,
			opacity: source.opacity,
		});

		setTimeout(onLoad);

		return material;
	}

	/**
	 * draw LOGO
	 * @param logo text
	 * @returns bitmap
	 */
	public drawLogo(logo: string) {
		const size = 256;
		const canvas = new OffscreenCanvas(size, size);
		const ctx = canvas.getContext("2d")!;
		ctx.scale(1, -1);
		ctx.translate(0, -size);
		if (ctx) {
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
