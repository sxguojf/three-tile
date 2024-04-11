import { BaseSource, SourceOptions } from "../../source/BaseSource";

type Style = "img" | "cia" | "terrain_rgb";
export type ZKXTSourceOptions = SourceOptions & {
	style?: Style;
	token: string;
	format?: string;
};

/**
 * ZhongkeXingTu datasource
 */
export class ZKXTSource extends BaseSource {
	public readonly attribution = "中科星图[GS(2022)3995号]";
	public token: string = "";
	public style: Style = "img";
	public format = "webp";
	public subdomains = "12";
	public url = "https://tiles{s}.geovisearth.com/base/v1/{style}/{z}/{x}/{y}?format={format}&tmsIds=w&token={token}";

	constructor(options?: ZKXTSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
