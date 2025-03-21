import { TileMap } from "../../map";
export declare function getTileCount(tileMap: TileMap): {
    total: number;
    visible: number;
    leaf: number;
    maxLevel: number;
    downloading: number;
};
