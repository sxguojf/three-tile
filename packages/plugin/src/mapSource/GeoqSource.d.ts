import { SourceOptions, TileSource } from "three-tile";
export type GeoqSourceOptions = SourceOptions & {
    style?: string;
};
/**
 * Geoq datasource
 */
export declare class GeoqSource extends TileSource {
    dataType: string;
    maxLevel: number;
    attribution: string;
    style: string;
    url: string;
    constructor(options?: GeoqSourceOptions);
}
