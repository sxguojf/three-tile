import { TileSource, SourceOptions } from "../../source";
export type ArcGisSourceOptions = SourceOptions & {
    style?: string;
};
/**
 *  ArcGis datasource
 */
export declare class ArcGisSource extends TileSource {
    dataType: string;
    attribution: string;
    style: string;
    url: string;
    constructor(options?: ArcGisSourceOptions);
}
/**
 * ArcGis terrain datasource
 */
export declare class ArcGisDemSource extends TileSource {
    dataType: string;
    attribution: string;
    minLevel: number;
    maxLevel: number;
    url: string;
    constructor(options?: SourceOptions);
}
