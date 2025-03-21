import { TileMap, Tile } from "../tt";

export function getTileCount(tileMap: TileMap) {
	let total = 0,
		visible = 0,
		maxLevel = 0,
		leaf = 0,
		downloading = 0;

	tileMap.rootTile.traverse((tile) => {
		if (!tile.isTile) return;

		total++;
		if (tile.isLeaf) {
			leaf++;
			if (tile.inFrustum) visible++;
		}
		maxLevel = Math.max(maxLevel, tile.z);
		downloading = Tile.downloadThreads;
	});
	return { total, visible, leaf, maxLevel: maxLevel, downloading: downloading };
}
