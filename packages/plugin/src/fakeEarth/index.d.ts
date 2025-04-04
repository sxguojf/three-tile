/**
 *@description: Fake Earth
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { ColorRepresentation } from "three";
import { FakeEarth } from "./FakeEarth";
import { TileMap } from "three-tile";
export { EarthMaskMaterial } from "./EarthMaskMaterial";
export { FakeEarth };
export declare function createFrakEarth(map: TileMap, bkColor?: ColorRepresentation, airColor?: ColorRepresentation): FakeEarth;
