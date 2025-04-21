import { SourceOptions, TileSource, VectorStyle } from "three-tile";

export type GeoJSONSourceOptions = SourceOptions & { style?: VectorStyle };

export class GeoJSONSource extends TileSource {
	public dataType = "geojson";
	public style: VectorStyle = {};

	public constructor(options: GeoJSONSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
