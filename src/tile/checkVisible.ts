import { Tile } from "./Tile";

export function checkVisible(tile: Tile): boolean {
	const leafs: Tile[] = [];
	tile.traverse((child) => leafs.push(child));
	const loaded = !leafs.filter((child) => child.isLeafInFrustum).some((child) => child.loadState != "loaded");
	if (loaded) {
		leafs.forEach((child) => {
			if (child.isLeaf) {
				child.isTemp = false;
			} else {
				child.dispose(false);
			}
		});
	}
	return loaded;
}

export function checkVisible1(tile: Tile): boolean {
	if (!tile.inFrustum) {
		return true;
	}
	if (tile.isLeaf) {
		return tile.loadState === "loaded";
	}
	const loaded = tile.children.every((child) => checkVisible(child));
	if (loaded) {
		tile.dispose(false);
		tile.children
			.filter((child) => child.inFrustum)
			.forEach((child) => {
				child.isTemp = child.isLeaf;
			});
	} else {
	}
	return loaded;
}
