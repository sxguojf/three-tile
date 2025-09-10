import { ColorRepresentation } from "three";
import { SourceOptions, TileSource } from "three-tile";

export type BackgroundSourceOptions = SourceOptions & { color: ColorRepresentation };

export class BackgroundSource extends TileSource {
	public dataType = "background";
	public color: ColorRepresentation = 0x112233;

	public constructor(options: BackgroundSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
