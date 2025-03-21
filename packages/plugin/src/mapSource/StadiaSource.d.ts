import { TileSource, SourceOptions } from "../tt";
/**
 * Stadia data source
 */
export declare class StadiaSource extends TileSource {
	dataType: string;
	attribution: string;
	url: string;
	constructor(options?: SourceOptions);
}
