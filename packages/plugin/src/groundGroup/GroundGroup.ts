import { Box3, Group, Object3D, Vector3 } from "three";
import { TileMap } from "three-tile";

const tempVec3 = new Vector3();
const tempBox3 = new Box3();

/**
 * 贴地模型组，加入该组的模型将自动贴地
 */
export class GroundGroup extends Group {
	public map: TileMap;

	/**
	 * 是否每块瓦片下载完成调整模型高度以贴地, 如果未false，仅在瓦片全部下载完成后调整模型高度以贴地
	 */
	public updateAllTiles = false;
	/**
	 * 贴地模型组（ 创建后会自动加入地图）
	 * @param map 地图
	 * @param params {updateEveryTile：是否每块瓦片下载完成调整模型高度以贴地}
	 */
	constructor(map: TileMap, params = { updateAllTiles: false }) {
		super();
		const { updateAllTiles: updateEveryTile = false } = params;
		this.map = map;
		this.updateAllTiles = updateEveryTile;
		map.addEventListener("tile-loaded", () => {
			this.updateAllTiles && this.update();
		});
		map.addEventListener("loading-complete", () => this.update());
		map.add(this);
	}

	public add(...object: Object3D[]): this {
		super.add(...object);
		object.forEach(obj => obj.updateMatrixWorld());
		this.update(...object);
		return this;
	}

	public update(...object: Object3D[]) {
		if (this.map.debug > 0) {
			console.time("ClampToGround");
		}
		if (object.length === 0) {
			this.children.forEach((child: Object3D) => {
				clampToGround(this.map, child);
			});
		} else {
			for (const objject of object) {
				clampToGround(this.map, objject);
			}
		}
		if (this.map.debug > 0) {
			console.timeEnd("ClampToGround");
		}
		return this;
	}
}

/**
 * 将指定模型贴地
 * @param map 地图
 * @param obj 模型(需要添加在TileMap里)
 */
export function clampToGround(map: TileMap, obj: Object3D) {
	const worldPosition = obj.getWorldPosition(tempVec3);
	const info = map.getLocalInfoFromWorld(worldPosition);
	if (info) {
		const size = tempBox3.setFromObject(obj).getSize(tempVec3);
		const center = tempBox3.getCenter(new Vector3());
		const bottomY = center.y - size.y / 2;
		const offsetY = info.location.z - bottomY;
		obj.position.z += offsetY;
	}
	return info;
}
