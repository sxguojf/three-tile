import { SourceOptions, TileSource } from "three-tile";

export type MapBoxSourceOptions = SourceOptions & {
	style?: string;
	token: string;
};

/**
 * MapBox datasource
 */
export class MapBoxSource extends TileSource {
	public token: string = "";
	public format: string = "webp";
	public style: string = "mapbox.satellite";
	public attribution = "MapBox";
	public maxLevel: number = 19;
	public url = "https://api.mapbox.com/v4/{style}/{z}/{x}/{y}.{format}?access_token={token}";

	constructor(options?: MapBoxSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
