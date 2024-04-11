/**
 *@description: fake Earth. three-tile Earth is plan, Add a fake ball to looks like a sphere
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferGeometry, Color, Mesh, PlaneGeometry } from "three";
import { EarthMaskMaterial } from "./EarthMaskMaterial";

/**
 * A Earth ball mask
 */
export class FakeEarth extends Mesh<BufferGeometry, EarthMaskMaterial> {
	public get bkColor() {
		return this.material.uniforms.bkColor.value;
	}

	public set bkColor(value: Color) {
		this.material.uniforms.bkColor.value.set(value);
	}

	public constructor(bkColor: Color, airColor: Color = new Color(0x6699cc)) {
		super(new PlaneGeometry(5, 5), new EarthMaskMaterial({ bkColor, airColor }));
		this.renderOrder = 999;
	}
}
