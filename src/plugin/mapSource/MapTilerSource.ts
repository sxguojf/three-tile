import { TileSource, SourceOptions } from "../../source";

export type MapTilerSourceOptins = SourceOptions & {
	style?: string;
	token: string;
	format: string;
};

/**
 * MapTiler data source
 */
export class MapTilerSource extends TileSource {
	public attribution = "MapTiler";
	public token: string = "get_your_own_key_QmavnBrQwNGsQ8YvPzZg";
	public format: string = "jpg";
	public style: string = "satellite-v2";
	public url = "https://api.maptiler.com/tiles/{style}/{z}/{x}/{y}.{format}?key={token}";

	constructor(options?: MapTilerSourceOptins) {
		super(options);
		Object.assign(this, options);
	}
}
