import { ColorRepresentation } from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { MapFog } from "./MapFog";
export { MapFog };
export type CreateFogParams = {
    controls: MapControls;
    fogColor?: ColorRepresentation;
};
export declare function createFog(controls: MapControls, fogColor?: ColorRepresentation): MapFog;
