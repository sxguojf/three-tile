/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferAttribute, PlaneGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";
import { Martini } from "./Martini";
import { addSkirt } from "./skirt";
import { maxErrors } from "./sse";
import { getGeometryDataFromDem } from "./utils";

/**
 * Tile geometry
 */
export class TileGeometry extends PlaneGeometry {
	public type = "TileGeometry";

	public setAttribes(geometryData: GeometryDataType, z = 0) {
		const skirtHeight = z === 0 ? 0 : 2e5 / z / z;
		// if (skirtHeight > 0) {
		geometryData = addSkirt(geometryData.attributes, geometryData.indices, skirtHeight);
		// }
		const { attributes, indices } = geometryData;

		this.setIndex(new BufferAttribute(indices, 1));
		this.setAttribute("position", new BufferAttribute(attributes.position.value, attributes.position.size));
		this.setAttribute("uv", new BufferAttribute(attributes.texcoord.value, attributes.texcoord.size));
		this.setAttribute("normal", new BufferAttribute(attributes.normal.value, attributes.normal.size));

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
