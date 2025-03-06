import { TileMap } from "../../map";
import { Tile } from "../../tile";

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
