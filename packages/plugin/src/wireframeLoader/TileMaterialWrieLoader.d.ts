/**
 *@description: Wireframe material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { Material } from "three";
import { ITileMaterialLoader, TileSourceLoadParamsType } from "three-tile";
/**
 * Wireframe material loader
 */
export declare class TileMaterialWrieLoader implements ITileMaterialLoader {
    readonly info: {
        version: string;
        description: string;
    };
    readonly dataType: string;
    load(params: TileSourceLoadParamsType): Promise<Material>;
}
