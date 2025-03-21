import { TileSource, SourceOptions } from "../../source";
type Style = "img_w" | "cia_w" | "cva_w" | "ibo_w" | "ter_w" | "vec_w" | "cta_w" | "img_c" | "cia_c";
export type TDTSourceOptins = SourceOptions & {
    style?: Style;
    token: string;
};
/**
 * TianDiTu datasource
 */
export declare class TDTSource extends TileSource {
    dataType: string;
    attribution: string;
    token: string;
    style: Style;
    subdomains: string;
    url: string;
    constructor(options?: TDTSourceOptins);
}
export declare class TDTQMSource extends TileSource {
    dataType: string;
    attribution: string;
    token: string;
    subdomains: string;
    url: string;
    constructor(options?: TDTSourceOptins);
}
export {};
