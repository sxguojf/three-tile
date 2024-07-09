import { PlaneGeometry } from "three";

/**
 * Create geomety from rules grid dem, it has gap between tiles
 */
export class TileSimpleGeometry extends PlaneGeometry {
	protected build(dem: ArrayLike<number>, tileSize: number) {
		this.dispose();
		this.copy(new PlaneGeometry(1, 1, tileSize - 1, tileSize - 1));
		const positions = this.getAttribute("position");
		// set dem
		for (let i = 0; i < positions.count; i++) {
			positions.setZ(i, dem[i]);
		}
	}

	public setData(dem: ArrayLike<number>, tileSize: number) {
		if (dem.length != tileSize * tileSize) {
			throw "DEM array size error!";
		}
		this.build(dem, tileSize);

		this.computeBoundingBox();
		this.computeBoundingSphere();
		this.computeVertexNormals();
		return this;
	}
}
