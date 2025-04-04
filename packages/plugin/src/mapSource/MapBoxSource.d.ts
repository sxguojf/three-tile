import { SourceOptions, TileSource } from "three-tile";
export type MapBoxSourceOptions = SourceOptions & {
    style?: string;
    token: string;
};
/**
 * MapBox datasource
 */
export declare class MapBoxSource extends TileSource {
    token: string;
    format: string;
    style: string;
    attribution: string;
    maxLevel: number;
    url: string;
    constructor(options?: MapBoxSourceOptions);
}
