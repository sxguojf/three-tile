import { TileSource } from "three-tile";
import { DEMType } from "./parse";
export declare class TifDemSource extends TileSource {
    dataType: string;
    data?: DEMType;
}
