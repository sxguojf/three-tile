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
	}
}

Object.defineProperty(TileMap.prototype, "tileCount", {
	get() {
		let total = 0,
			visible = 0,
			maxLevel = 0,
			leaf = 0,
			downloading = 0;

		this.rootTile.traverse((tile: Tile) => {
			if (tile.isTile) {
				total++;
				tile.isLeaf && tile.inFrustum && visible++;
				tile.isLeaf && leaf++;
				maxLevel = Math.max(maxLevel, tile.z);
				downloading = Tile.downloadThreads;
			}
		});
		return { total, visible, leaf, maxLevle: maxLevel, downLoading: downloading };
	},
	configurable: true,
});

// TileMap.prototype.tileCount = function () {
// 	let total = 0,
// 		visible = 0,
// 		maxLevel = 0,
// 		leaf = 0,
// 		downloading = 0;

// 	this.rootTile.traverse((tile) => {
// 		if (tile.isTile) {
// 			total++;
// 			tile.isLeaf && tile.inFrustum && visible++;
// 			tile.isLeaf && leaf++;
// 			maxLevel = Math.max(maxLevel, tile.z);
// 			downloading = Tile.downloadThreads;
// 		}
// 	});
// 	return { total, visible, leaf, maxLevle: maxLevel, downLoading: downloading };
// };
