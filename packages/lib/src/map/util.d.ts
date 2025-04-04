/**
 *@description: Map function
 *@author: 郭江峰
 *@date: 2024-04-08
 */
import { Camera, Intersection, Raycaster, Sprite, Vector2, Vector3 } from "three";
import { TileMap } from "./TileMap";
/**
 * ground location inifo type
 */
export interface LocationInfo extends Intersection {
    location: Vector3;
}
/**
 * get ground info from an ary
 * @param map
 * @param ray
 * @returns intersect info or undefined(not intersect)
 */
export declare function getLocalInfoFromRay(map: TileMap, ray: Raycaster): LocationInfo | undefined;
/**
 * get ground info from world coordinate
 * @param worldPosition world coordinate
 * @returns ground info
 */
export declare function getLocalInfoFromWorld(map: TileMap, worldPosition: Vector3): LocationInfo | undefined;
/**
 * get ground info from screen coordinate
 * @param camera
 * @param pointer screen coordiante（-0.5~0.5）
 * @returns ground info
 */
export declare function getLocalInfoFromScreen(camera: Camera, map: TileMap, pointer: Vector2): LocationInfo | undefined;
export declare function attachEvent(map: TileMap): void;
export declare function createBillboards(txt: string, size?: number): Sprite<import("three").Object3DEventMap>;
