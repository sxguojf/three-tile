import { Camera, PerspectiveCamera, Vector3 } from "three";
import "./getAttributions";
import "./getLocalFromMouse";
import "./getTileCount";
import "./limitCameraHeight";

// export type GetLocalFromMouseParasms = {
// 	camera: Camera;
// 	width: number;
// 	height: number;
// };

export type LimitCameraHeightParams = {
	camera: PerspectiveCamera; // 摄像机
	limitHeight?: number; //限制高度
};

declare module "../../map" {
	interface TileMap {
		/**
		 * 瓦片数量统计
		 */
		get tileCount(): {
			total: number;
			visible: number;
			leaf: number;
			maxLevle: number;
			downLoading: number;
		};
		getTileCount(): { total: number; visible: number; leaf: number; maxLevle: number; downLoading: number };

		/**
		 * 限制摄像机高度，需要在场景每帧更新中调用
		 * @param params
		 */
		limitCameraHeight(params: LimitCameraHeightParams): boolean;

		/**
		 * Get map source attributions information
		 * 取得地图数据归属版权信息
		 */
		getAttributions(): string[];

		/**
		 * 取得鼠标处经纬度海拔高度
		 * @param xy PointerEvent中的xy
		 * @param params
		 * @returns
		 */
		getLocalFromMouse: (pointerEvent: PointerEvent, camera: Camera) => Vector3 | undefined;

		// flyTo(centerPostion: Vector3, cameraPostion: Vector3, animate?: boolean): TileMap;
	}
}
