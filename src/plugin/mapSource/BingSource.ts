import { TileSource, SourceOptions } from "../../source";

/**
- A：卫星图像图层（Aerial）。
- R：道路图层（Road）。
- H：高度图层（Height）。
- O：鸟瞰图图层（Oblique）。
- B：建筑物图层（Building）。
- P：地形图层（Terrain）。
- G：地理特征图层（Geography）。
- T：交通图层（Traffic）。
- L：标签图层（Label）。
 */
export type BingSourceOptions = SourceOptions & { style?: string };

/**
 * Bing datasource
 */
export class BingSource extends TileSource {
	public dataType: string = "image";
	public attribution = "Bing[GS(2021)1731号]";
	public style: string = "A";
	public mkt: string = "zh-CN";
	public subdomains = "123";

	public constructor(options?: BingSourceOptions) {
		super(options);
		Object.assign(this, options);
	}

	public getUrl(x: number, y: number, z: number): string {
		const key = quadKey(z, x, y);
		return `https://t${this.s}.dynamic.tiles.ditu.live.com/comp/ch/${key}?mkt=${this.mkt}&ur=CN&it=${this.style}&n=z&og=804&cstl=vb`;
	}
}

function quadKey(z: number, x: number, y: number): string {
	let quad = "";
	for (let i = z; i > 0; i--) {
		const mask = 1 << (i - 1);
		let cell = 0;
		if ((x & mask) !== 0) {
			cell++;
		}
		if ((y & mask) !== 0) {
			cell += 2;
		}
		quad += cell;
	}
	return quad;
}
