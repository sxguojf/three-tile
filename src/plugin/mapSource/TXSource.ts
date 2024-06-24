// type Style = "img_w" | "cia_w" | "cva_w" | "ibo_w" | "ter_w" | "vec_w";

import { TileSource, SourceOptions } from "../../source";

export type TXSourceOptins = SourceOptions & {
	style?: string;
};

/** Tencent datasource */
export class TXSource extends TileSource {
	public dataType = "image";
	public style: string = "sateTiles";
	public attribution = "腾讯[GS(2023)1号]";
	public subdomains = "0123";
	public maxLevel: number = 18;

	public constructor(options?: TXSourceOptins) {
		super(options);
		Object.assign(this, options);
	}
	public getUrl(x: number, y: number, z: number): string {
		// https://blog.csdn.net/mygisforum/article/details/22997879
		// 腾讯瓦片计算方法：URL = z  /  Math.Floor(x / 16.0)  / Math.Floor(y / 16.0) / x_y.png，其中x,y,z为TMS瓦片坐标参数。
		const sx = x >> 4;
		const sy = ((1 << z) - y) >> 4;
		const reverseY = Math.pow(2, z) - 1 - y;
		return `https://p${this.s}.map.gtimg.com/${this.style}/${z}/${sx}/${sy}/${x}_${reverseY}.jpg`;
	}
}
