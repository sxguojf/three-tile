/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferAttribute, PlaneGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";
import { addSkirt } from "./skirt";
import { getGeometryDataFromDem } from "./utils";

/**
 * Inherit of PlaneGeometry, add setData method
 */
export class TileGeometry extends PlaneGeometry {
	public type = "TileGeometry";

	/**
	 * set attribute data to geometry
	 * @param data geometry or DEM data
	 * @returns this
	 */
	public setData(data: GeometryDataType | Float32Array, skirtHeight: number = 1000) {
		let geoData = data instanceof Float32Array ? getGeometryDataFromDem(data) : data;

		// Add a skirt(1000m) to the geometry
		geoData = addSkirt(geoData.attributes, geoData.indices, skirtHeight);

		const { attributes, indices } = geoData;
		this.setIndex(new BufferAttribute(indices, 1));
		this.setAttribute("position", new BufferAttribute(attributes.position.value, attributes.position.size));
		this.setAttribute("uv", new BufferAttribute(attributes.texcoord.value, attributes.texcoord.size));
		this.setAttribute("normal", new BufferAttribute(attributes.normal.value, attributes.normal.size));

		// 感觉加上这两句速度会快一点, 幻觉?
		this.computeBoundingBox();
		this.computeBoundingSphere();
		return this;
	}
}
