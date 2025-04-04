/**
 *@description: Texture loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Texture } from "three";
import { ISource } from "../source";
/**
 * texture loader
 */
export declare class TileTextureLoader {
    private loader;
    /**
     * load the tile texture
     * @param tile tile to load
     * @param source datasource
     * @returns texture
     */
    load(source: ISource, x: number, y: number, z: number): Promise<Texture>;
}
