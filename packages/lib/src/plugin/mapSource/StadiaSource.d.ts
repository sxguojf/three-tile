import { TileSource, SourceOptions } from "../../source";
/**
 * Stadia data source
 */
export declare class StadiaSource extends TileSource {
    dataType: string;
    attribution: string;
    url: string;
    constructor(options?: SourceOptions);
}
