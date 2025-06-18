import { TileSource } from "three-tile";

/**
 * WMS datasource
 */
export class WmsSource extends TileSource {
	public dataType: string = "image";
	public bbox = "";

	public getUrl(x: number, y: number, z: number) {
		this.bbox = tileToWebMercatorBoundingBox(x, y, z);
		return super.getUrl(x, y, z);
	}
}

function tileToWebMercatorBoundingBox(x: number, y: number, z: number) {
	const earthRadius = 6378137;
	const worldSize = 2 * Math.PI * earthRadius;
	const tileSize = worldSize / Math.pow(2, z);
	const bbox = {
		minX: -worldSize / 2 + x * tileSize,
		minY: worldSize / 2 - (y + 1) * tileSize,
		maxX: -worldSize / 2 + (x + 1) * tileSize,
		maxY: worldSize / 2 - y * tileSize,
	};
	return `${bbox.minX},${bbox.minY},${bbox.maxX},${bbox.maxY}`;
}
