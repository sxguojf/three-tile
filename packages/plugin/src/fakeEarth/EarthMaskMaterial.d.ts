/**
 *@description: Fake earth material
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { Color, ShaderMaterial } from "three";
/**
 * a fake ball Material
 */
export declare class EarthMaskMaterial extends ShaderMaterial {
    constructor(parameters: {
        bkColor: Color;
        airColor: Color;
    });
}
