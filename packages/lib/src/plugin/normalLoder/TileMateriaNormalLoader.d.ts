/**
 *@description: Tile normal loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { Material } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from "../..";
/**
 * Tile normal Material loader
 */
export declare class TileMateriaNormalLoader implements ITileMaterialLoader {
    readonly info: {
        version: string;
        description: string;
    };
    readonly dataType: string;
    load(params: TileSourceLoadParamsType): Promise<Material>;
}
