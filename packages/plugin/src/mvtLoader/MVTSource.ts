import { SourceOptions, TileSource, VectorStyles } from "three-tile";
import { StyleType } from "./MVTLoader";

export type MVTSourceOptions = SourceOptions & { style?: { layer: VectorStyles } };

export class MVTSource extends TileSource {
	public dataType = "mvt";
	public style: StyleType = { layer: [] };
	//  "https://demotiles.maplibre.org/style.json";

	public constructor(options: MVTSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
