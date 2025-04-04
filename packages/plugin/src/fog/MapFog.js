import { FogExp2 } from "three";
export class MapFog extends FogExp2 {
    _controls;
    _factor = 1.0;
    get factor() {
        return this._factor;
    }
    set factor(value) {
        this._factor = value;
        this._controls.dispatchEvent({ type: "change" });
    }
    constructor(controls, color) {
        super(color);
        this._controls = controls;
        controls.addEventListener("change", () => {
            const polar = Math.max(controls.getPolarAngle(), 0.1);
            const dist = Math.max(controls.getDistance(), 0.1);
            this.density = (polar / (dist + 5)) * this.factor * 0.25;
        });
    }
}
