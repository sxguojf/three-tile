import { Camera, PerspectiveCamera, Vector3 } from "three";
import { TileMap } from "three-tile";
export declare function getLocalFromMouse(pointerEvent: PointerEvent, map: TileMap, camera: Camera): Vector3 | undefined;
export declare function getAttributions(map: TileMap): string[];
export type LimitCameraHeightParams = {
    camera: PerspectiveCamera;
    limitHeight?: number;
};
export declare function limitCameraHeight(map: TileMap, camera: PerspectiveCamera, limitHeight?: number): boolean;
