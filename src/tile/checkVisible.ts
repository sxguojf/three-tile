import { Tile } from "./Tile";

// todo: 多次递归影响速度，考虑使用一次后序递归解决
export function checkVisible(tile: Tile) {
	tile.showing = false;
	// Hide if tile is not a leaf and it has showing child
	if (!tile.isLeaf && !!getVisibleChildren(tile)) {
		return;
	}

	const loadedParent = getVisibleParent(tile);
	if (loadedParent) {
		checkChildVisible(loadedParent);
	} else {
		tile.showing = true;
	}
}

function checkChildVisible(tile: Tile) {
	if (!tile.isLeaf) {
		const loaded = tile.children.every((child) => child.loadState === "loaded");
		tile.showing = !loaded;
		tile.children.forEach((child) => {
			child.showing = loaded;
			if (loaded) {
				checkChildVisible(child);
			}
		});
	}
}

function getVisibleChildren(tile: Tile) {
	let result = null;
	tile.traverse((child) => {
		if (child.showing && child !== tile && child.loadState === "loaded") {
			result = child;
		}
	});
	return result;
}

function getVisibleParent(tile: Tile): Tile | null {
	const parent = tile.parent;
	if (!parent || !parent.isTile) {
		return null;
	}
	if (parent.showing && parent.loadState === "loaded") {
		return parent;
	}
	return getVisibleParent(parent);
}
