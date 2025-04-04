import { SourceOptions, TileSource } from "three-tile";
/**
 * Stadia data source
 */
export declare class StadiaSource extends TileSource {
    dataType: string;
    attribution: string;
    url: string;
    constructor(options?: SourceOptions);
}
