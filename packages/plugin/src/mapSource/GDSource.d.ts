import { SourceOptions, TileSource } from "three-tile";
/**  6卫星（st），7简图（st rd），8详图（不透明rd，透明图st）*/
type Style = "6" | "7" | "8";
export type GDSourceOptions = SourceOptions & {
    style?: Style;
};
/**
 * GaoDe datasource
 */
export declare class GDSource extends TileSource {
    dataType: string;
    attribution: string;
    style: Style;
    subdomains: string;
    maxLevel: number;
    url: string;
    constructor(options?: GDSourceOptions);
}
export {};
