/**
 *@description: Tile Geometry
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferAttribute, PlaneGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";
import { getGeometryDataFromDem } from "./utils";

/**
 * Inherit of PlaneGeometry, add setData and setDEM method
 */
export class TileGeometry extends PlaneGeometry {
	public readonly type = "TileGeometry";
	/**
	 * set the tile geometry data
	 * @param geoData geometry data
	 * @returns this
	 */
	public setData(geoData: GeometryDataType) {
		this.setIndex(new BufferAttribute(geoData.indices, 1));
		this.setAttribute(
			"position",
			new BufferAttribute(geoData.attributes.position.value, geoData.attributes.position.size),
		);
		this.setAttribute(
			"uv",
			new BufferAttribute(geoData.attributes.texcoord.value, geoData.attributes.texcoord.size),
		);
		this.setAttribute(
			"normal",
			new BufferAttribute(geoData.attributes.normal.value, geoData.attributes.normal.size),
		);

		// 感觉加上这两句速度会快一点, 幻觉?
		this.computeBoundingBox();
		this.computeBoundingSphere();
		return this;
	}

	public setDEM(dem: Float32Array) {
		const geoData = getGeometryDataFromDem(dem, true);
		return this.setData(geoData);
	}
}
