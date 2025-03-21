import { Camera, Vector3 } from "three";
import { TileMap } from "../tt";
export declare function getLocalFromMouse(
	pointerEvent: PointerEvent,
	map: TileMap,
	camera: Camera,
): Vector3 | undefined;
