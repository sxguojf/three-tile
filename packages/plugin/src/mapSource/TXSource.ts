import { SourceOptions, TileSource } from "three-tile";
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
	public isTMS: boolean = true;
	// public url = "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
	public url = "https://p{s}.map.gtimg.com/{style}/{z}/{sx}/{sy}/{x}_{y}.jpg";

	public constructor(options?: TXSourceOptins) {
		super(options);
		Object.assign(this, options);
	}
	public getUrl(x: number, y: number, z: number) {
		// https://blog.csdn.net/mygisforum/article/details/22997879
		// 腾讯瓦片计算方法：URL = z  /  Math.Floor(x / 16.0)  / Math.Floor(y / 16.0) / x_y.png，其中x,y,z为TMS瓦片坐标参数。
		const sx = x >> 4;
		const sy = ((1 << z) - y) >> 4;
		const obj = { sx, sy };
		return super.getUrl(x, y, z, obj);
	}
}
