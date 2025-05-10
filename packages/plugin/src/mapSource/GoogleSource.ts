import { SourceOptions, TileSource } from "three-tile";

/**
    m 标准路线图 lyrs=m
    r 某种改变的路线图（路线不明显） lyrs=r
    s 影像层（卫星图） lyrs=s
    y 带标签的卫星图 lyrs=y
    h 标签层（路名、地名等） lyrs=h
    t 地形图 lyrs=t
    p 带标签的地形图 lyrs=p
*/
type Style = "s" | "m" | "r" | "y" | "h" | "t" | "p";
export type GoogleSourceOptions = SourceOptions & { style?: Style };

/**
 * Google datasource, can not uese in CN
 */
export class GoogleSource extends TileSource {
	public dataType = "image";
	public attribution = "Google";
	public maxLevel = 20;
	public style: Style = "s";
	public subdomains = "0123";

	// 已失效
	// public url = "https://gac-geo.googlecnapps.cn/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";

	// 2024年新地址，不知道能坚持多久。 续：坚持不到10天就挂了。
	// public url = "https://gac-geo.googlecnapps.club/maps/vt?lyrs={style}&x={x}&y={y}&z={z}";

	// 访问原版google，你懂的
	public url = "http://mt{s}.google.com/vt/lyrs={style}&src=app&x={x}&y={y}&z={z}";

	constructor(options?: GoogleSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
