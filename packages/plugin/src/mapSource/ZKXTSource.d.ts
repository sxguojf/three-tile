import { SourceOptions, TileSource } from "three-tile";
type Style = "img" | "cia" | "terrain_rgb";
export type ZKXTSourceOptions = SourceOptions & {
    style?: Style;
    token: string;
    format?: string;
};
/**
 * ZhongkeXingTu datasource
 */
export declare class ZKXTSource extends TileSource {
    readonly attribution = "\u4E2D\u79D1\u661F\u56FE[GS(2022)3995\u53F7]";
    token: string;
    style: Style;
    format: string;
    subdomains: string;
    url: string;
    constructor(options?: ZKXTSourceOptions);
}
export declare class ZKXTQMSource extends TileSource {
    dataType: string;
    attribution: string;
    token: string;
    subdomains: string;
    url: string;
    constructor(options?: ZKXTSourceOptions);
}
export {};
