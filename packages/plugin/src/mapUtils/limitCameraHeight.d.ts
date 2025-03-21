import { PerspectiveCamera } from "three";
import { TileMap } from "../tt";
export type LimitCameraHeightParams = {
	camera: PerspectiveCamera;
	limitHeight?: number;
};
export declare function limitCameraHeight(map: TileMap, camera: PerspectiveCamera, limitHeight?: number): boolean;
