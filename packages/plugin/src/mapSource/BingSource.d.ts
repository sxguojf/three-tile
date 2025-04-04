import { SourceOptions, TileSource } from "three-tile";
/**
- A：卫星图像图层（Aerial）。
- R：道路图层（Road）。
- H：高度图层（Height）。
- O：鸟瞰图图层（Oblique）。
- B：建筑物图层（Building）。
- P：地形图层（Terrain）。
- G：地理特征图层（Geography）。
- T：交通图层（Traffic）。
- L：标签图层（Label）。
 */
export type BingSourceOptions = SourceOptions & {
    style?: string;
};
/**
 * Bing datasource
 */
export declare class BingSource extends TileSource {
    dataType: string;
    attribution: string;
    style: string;
    mkt: string;
    subdomains: string;
    constructor(options?: BingSourceOptions);
    getUrl(x: number, y: number, z: number): string;
}
