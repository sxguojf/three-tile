import { SourceOptions, TileSource } from "three-tile";
export type MapTilerSourceOptins = SourceOptions & {
    style?: string;
    token: string;
    format: string;
};
/**
 * MapTiler data source
 */
export declare class MapTilerSource extends TileSource {
    attribution: string;
    token: string;
    format: string;
    style: string;
    url: string;
    constructor(options?: MapTilerSourceOptins);
}
