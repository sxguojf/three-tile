import { TileSource, SourceOptions } from "../../source";
/**
    m 标准路线图 lyrs=m
    r 某种改变的路线图（路线不明显） lyrs=r
    s 影像层（卫星图） lyrs=s
    y 带标签的卫星图 lyrs=y
    h 标签层（路名、地名等） lyrs=h
    t 地形图 lyrs=t
    p 带标签的地形图 lyrs=p
*/
type Style = "s" | "m" | "r" | "y" | "h" | "t" | "p";
export type GoogleSourceOptions = SourceOptions & {
    style?: Style;
};
/**
 * Google datasource, can not uese in CN
 */
export declare class GoogleSource extends TileSource {
    dataType: string;
    attribution: string;
    maxLevel: number;
    style: Style;
    protected subdomains: string;
    url: string;
    constructor(options?: GoogleSourceOptions);
}
export {};
