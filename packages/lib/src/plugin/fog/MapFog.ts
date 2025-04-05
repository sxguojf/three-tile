import { ColorRepresentation, FogExp2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class MapFog extends FogExp2 {
	private _controls: OrbitControls;
	private _factor = 1.0;
	public get factor() {
		return this._factor;
	}
	public set factor(value) {
		this._factor = value;
		this._controls.dispatchEvent({ type: "change" });
	}

	public constructor(controls: OrbitControls, color: ColorRepresentation) {
		super(color);
		this._controls = controls;
		controls.addEventListener("change", () => {
			const polar = Math.max(controls.getPolarAngle(), 0.1);
			const dist = Math.max(controls.getDistance(), 0.1);
			this.density = (polar / (dist + 5)) * this.factor * 0.25;
		});
	}
}
