import { Tile } from "./Tile";

export function checkVisible(tile: Tile): boolean {
	if (!tile.inFrustum) {
		return true;
	}
	// is loaed when load state is loaded or not in frustum, if the tile is leaf
	if (tile.isLeaf) {
		return tile.loadState === "loaded";
	}

	// recursion to decide the tile has loaded, if the tile not is leaf
	const loaded = tile.children.every((child) => checkVisible(child));

	// show leaf tile and free parent tile if all of tile has loade
	if (loaded) {
		tile.children.forEach((child) => {
			if (child.inFrustum) {
				if (child.isLeaf) {
					child.isTemp = false;
				}
				// else {
				// 	// child.isTemp = true;
				// 	child.dispose(false);
				// }
			}
		});
		tile.dispose(false);
	}
	// console.log(loaded);

	return loaded;
}
