import { PerspectiveCamera } from "three";
import { TileMap } from "../../map";
export type LimitCameraHeightParams = {
    camera: PerspectiveCamera;
    limitHeight?: number;
};
export declare function limitCameraHeight(map: TileMap, camera: PerspectiveCamera, limitHeight?: number): boolean;
