/**
 *@description: Fake Earth. three-tile Earth is plan, Add a fake ball to looks like a sphere
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { BufferGeometry, Color, Mesh } from "three";
import { EarthMaskMaterial } from "./EarthMaskMaterial";
/**
 * A Earth ball mask
 */
export declare class FakeEarth extends Mesh<BufferGeometry, EarthMaskMaterial> {
    get bkColor(): Color;
    set bkColor(value: Color);
    constructor(bkColor: Color, airColor?: Color);
}
