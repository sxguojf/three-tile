import { SourceOptions, TileSource } from "three-tile";

export type MapBoxSourceOptions = SourceOptions & {
	style?: string;
	token: string;
};

/**
 * MapBox datasource
 */
export class MapBoxSource extends TileSource {
	protected token: string = "";
	protected format: string = "webp";
	protected style: string = "mapbox.satellite";
	public attribution = "MapBox";
	public maxLevel: number = 19;
	public url = "https://api.mapbox.com/v4/{style}/{z}/{x}/{y}.{format}?access_token={token}";

	constructor(options?: MapBoxSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
