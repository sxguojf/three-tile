import { BaseSource, SourceOptions } from "../../source/BaseSource";

/**
 * Baidu datasource
 */
export class BaiduSource extends BaseSource {
	public dataType: string = "image";
	public attribution = "百度[GS(2021)6026号]";
	public style: string;
	constructor(style = "pl", options?: SourceOptions) {
		super(options);
		this.style = style;
	}
	// todo: 瓦片计算有问题
	public getUrl(x: number, y: number, z: number): string {
		// const sx = Math.pow(2, z) - 1 - x;
		// const sy = Math.pow(2, z) - 1 - y;
		// const xy = googleToBaidu(x, y, z);

		// return `https://shangetu0.map.bdimg.com/it/u=x=${xy.x};y=${xy.y};z=${z};v=009;type=sate&fm=46`;
		// return `https://maponline0.bdimg.com/tile?x=${xy.x}&y=${xy.y}&z=${z}&img`;
		return `https://online0.map.bdimg.com/tile/?qt=tile&x=${x}&y=${y}&z=${z}&v=020`;
	}
}
