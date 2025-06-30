import { TileSource } from "three-tile";

/**  WMS datasource */
export class WmsSource extends TileSource {
	public dataType = "image";

	public getUrl(x: number, y: number, z: number) {
		const worldSize = Math.PI * 6378137;
		const tileSize = (2 * worldSize) / Math.pow(2, z);
		const minX = -worldSize + x * tileSize;
		const minY = worldSize - (y + 1) * tileSize;
		const maxX = -worldSize + (x + 1) * tileSize;
		const maxY = worldSize - y * tileSize;
		const bbox = `${minX},${minY},${maxX},${maxY}`;
		return super.getUrl(x, y, z, { bbox });
	}
}
