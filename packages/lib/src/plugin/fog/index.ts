import { ColorRepresentation } from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { MapFog } from "./MapFog";
export { MapFog };

export type CreateFogParams = {
	controls: MapControls;
	fogColor?: ColorRepresentation;
};

export function createFog(controls: MapControls, fogColor: ColorRepresentation = 0xdbf0ff): MapFog {
	return new MapFog(controls, fogColor);
}
