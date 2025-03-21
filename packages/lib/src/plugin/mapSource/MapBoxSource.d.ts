import { TileSource, SourceOptions } from "../../source";
export type MapBoxSourceOptions = SourceOptions & {
    style?: string;
    token: string;
};
/**
 * MapBox datasource
 */
export declare class MapBoxSource extends TileSource {
    protected token: string;
    protected format: string;
    protected style: string;
    attribution: string;
    maxLevel: number;
    url: string;
    constructor(options?: MapBoxSourceOptions);
}
