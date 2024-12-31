import { TileSource, SourceOptions } from "../../source/TileSource";

type Style = "img" | "cia" | "terrain_rgb";
export type ZKXTSourceOptions = SourceOptions & {
	style?: Style;
	token: string;
	format?: string;
};

// https://[tiles1-tiles3].geovisearth.com/base/v1/ter/{z}/{x}/{y}
// https://[tiles1-tiles3].geovisearth.com/base/v1/cia/{z}/{x}/{y}
// https://[tiles1-tiles3].geovisearth.com/base/v1/vec/{z}/{x}/{y}
// https://[tiles1-tiles3].geovisearth.com/base/v1/terrain-rgb/{z}/{x}/{y}

/**
 * ZhongkeXingTu datasource
 */
export class ZKXTSource extends TileSource {
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
