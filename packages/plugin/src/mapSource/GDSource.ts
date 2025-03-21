import { TileSource, SourceOptions } from "../tt";

/**  6卫星（st），7简图（st rd），8详图（不透明rd，透明图st）*/
type Style = "6" | "7" | "8";
export type GDSourceOptions = SourceOptions & { style?: Style };

/**
 * GaoDe datasource
 */
export class GDSource extends TileSource {
	public dataType = "image";
	public attribution = "高德[GS(2021)6375号]";
	public style: Style = "8";
	public subdomains = "1234";
	public maxLevel: number = 18;
	public url = "https://webst0{s}.is.autonavi.com/appmaptile?style={style}&x={x}&y={y}&z={z}";
	constructor(options?: GDSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
