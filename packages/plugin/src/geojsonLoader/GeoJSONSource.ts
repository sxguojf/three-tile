import { SourceOptions, TileSource, VectorStyle } from "three-tile";

export type GeoJSONSourceOptions = SourceOptions & { style?: VectorStyle };

export class GeoJSONSource extends TileSource {
	public dataType = "geojson";
	public loading = false;
	public style: VectorStyle = {};
	public gv: any;

	public constructor(options: GeoJSONSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
