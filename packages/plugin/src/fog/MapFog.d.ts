import { ColorRepresentation, FogExp2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export declare class MapFog extends FogExp2 {
    private _controls;
    private _factor;
    get factor(): number;
    set factor(value: number);
    constructor(controls: OrbitControls, color: ColorRepresentation);
}
