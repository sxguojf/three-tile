/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferAttribute, BufferGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";
import { addSkirt } from "./skirt";
import { getGeometryDataFromDem } from "./utils";
import { Martini } from "./Martini";
import { maxErrors } from "./sse";

/**
 * Tile geometry
 */
export class TileGeometry extends BufferGeometry {
	public type = "TileGeometry";

	public constructor() {
		super();
		const dem = new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0]);
		this.setData(dem, 1);
	}

	public setAttribes(geometryData: GeometryDataType, z = 1) {
		const skirtHeight = 5e3 / z;
		const geoDataWithSkirt = addSkirt(geometryData.attributes, geometryData.indices, skirtHeight);
		const { attributes, indices } = geoDataWithSkirt;

		this.setIndex(new BufferAttribute(indices, 1));
		this.setAttribute("position", new BufferAttribute(attributes.position.value, attributes.position.size));
		this.setAttribute("uv", new BufferAttribute(attributes.texcoord.value, attributes.texcoord.size));
		this.setAttribute("normal", new BufferAttribute(attributes.normal.value, attributes.normal.size));

		// this.index && (this.index.needsUpdate = true);
		// this.attributes.position.needsUpdate = true;
		// this.attributes.uv.needsUpdate = true;
		// this.attributes.normal.needsUpdate = true;
		// this.computeBoundingBox();
		// this.computeBoundingSphere();

		return this;
	}

	public setData(data: Float32Array, z: number, martini = false) {
		if (martini) {
			const gridSize = Math.sqrt(data.length);
			const martini = new Martini(gridSize);
			const tile = martini.createTile(data);
			const geometryData = tile.getGeometryData(maxErrors[z] || 0);
			this.setAttribes(geometryData, z);
		} else {
			const geometryData = getGeometryDataFromDem(data);
			this.setAttribes(geometryData, z);
		}

		return this;
	}
}
