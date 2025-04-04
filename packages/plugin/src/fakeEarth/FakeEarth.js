/**
 *@description: Fake Earth. three-tile Earth is plan, Add a fake ball to looks like a sphere
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Color, Mesh, PlaneGeometry } from "three";
import { EarthMaskMaterial } from "./EarthMaskMaterial";
/**
 * A Earth ball mask
 */
export class FakeEarth extends Mesh {
    get bkColor() {
        return this.material.uniforms.bkColor.value;
    }
    set bkColor(value) {
        this.material.uniforms.bkColor.value.set(value);
    }
    constructor(bkColor, airColor = new Color(0x6699cc)) {
        super(new PlaneGeometry(5, 5), new EarthMaskMaterial({ bkColor, airColor }));
        this.renderOrder = 999;
    }
}
