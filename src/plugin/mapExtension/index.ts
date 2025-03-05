import { TileMap } from "../../map";
import { Tile } from "../../tile";

declare module "../../map" {
	interface TileMap {
		get tileCount(): {
			total: number;
			visible: number;
			leaf: number;
			maxLevle: number;
			downLoading: number;
		};
		getTileCount(): { total: number; visible: number; leaf: number; maxLevle: number; downLoading: number };
		// flyTo(centerPostion: Vector3, cameraPostion: Vector3, animate?: boolean): TileMap;
	}
}

Object.defineProperty(TileMap.prototype, "tileCount", {
	get() {
		return getTileCount(this);
	},
});

function getTileCount(tileMap: TileMap) {
	let total = 0,
		visible = 0,
		maxLevel = 0,
		leaf = 0,
		downloading = 0;

	tileMap.rootTile.traverse((tile) => {
		if (tile.isTile) {
			total++;
			tile.isLeaf && tile.inFrustum && visible++;
			tile.isLeaf && leaf++;
			maxLevel = Math.max(maxLevel, tile.z);
			downloading = Tile.downloadThreads;
		}
	});
	return { total, visible, leaf, maxLevle: maxLevel, downLoading: downloading };
}

// TileMap.prototype.flyTo = function (centerPostion: Vector3, cameraPostion: Vector3, animate?: boolean): TileMap {
// 	this.controls.target.copy(centerPostion);
// 	if (animate) {
// 		const start = this.camera.position;
// 		new Tween(start)
// 			// fly to 10000km
// 			.to({ y: 10000, z: 0 }, 500)
// 			// to taget
// 			.chain(new Tween(start).to(cameraPostion, 2000).easing(TWEEN.Easing.Quintic.Out))
// 			.start();
// 	} else {
// 		this.camera.position.copy(cameraPostion);
// 	}
// 	return this;
// };
