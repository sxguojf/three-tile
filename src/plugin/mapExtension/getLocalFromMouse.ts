import { Vector2, Vector3 } from "three";
import { TileMap } from "../../map";
import { GetLocalFromMouseParasms } from ".";

TileMap.prototype.getLocalFromMouse = function (
	xy: { x: number; y: number },
	params: GetLocalFromMouseParasms,
): Vector3 | undefined {
	const { camera, width: continteWidth, height: containerHeight } = params;
	const pointer = new Vector2((xy.x / continteWidth) * 2 - 1, -(xy.y / containerHeight) * 2 + 1);
	const info = this.getLocalInfoFromScreen(camera, pointer);
	return info?.location;
};
