import { BaseSource, SourceOptions } from "../../source/BaseSource";

/**
 * Stadia data source
 */
export class StadiaSource extends BaseSource {
	public dataType: string = "image";
	public attribution = "Stadia";
	public url = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg";
	constructor(options?: SourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
