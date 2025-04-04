/**
 *@description: Tile uitls
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { Vector3 } from "three";
import { Tile } from ".";
import { ITileLoader } from "../loader";
export declare enum LODAction {
    none = 0,
    create = 1,
    remove = 2
}
export declare function getDistance(tile: Tile, cameraWorldPosition: Vector3): number;
export declare function getTileSize(tile: Tile): number;
/**
 * Evaluate the Level of Detail (LOD) action
 *
 * @param tile The tile object
 * @param minLevel The minimum level
 * @param maxLevel The maximum level
 * @param threshold The threshold value
 * @returns The LOD action type
 */
export declare function LODEvaluate(tile: Tile, minLevel: number, maxLevel: number, threshold: number): LODAction;
/**
 * Load the children tile from coordinate
 * @param loader tile loader instance
 * @param px parent tile x coordinate
 * @param py parent tile y coordinate
 * @param pz parent tile level
 * @returns children tile array
 */
export declare function createChildren(loader: ITileLoader, px: number, py: number, pz: number): Tile[];
