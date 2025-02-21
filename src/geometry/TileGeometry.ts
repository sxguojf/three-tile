/**
 *@description: Martini geomety with skrit
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferAttribute, PlaneGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";

/**
 * Inherit of PlaneGeometry, add setData method
 */
export class TileGeometry extends PlaneGeometry {
	public readonly type = "TileGeometry";
	/**
	 * set the tile geometry data
	 * @param geoInfo 瓦片网格数据，包含position, uv, indices等属性
	 * @returns this
	 */
	public setData(geoInfo: GeometryDataType) {
		// this.dispose();
		this.setIndex(new BufferAttribute(geoInfo.indices, 1));
		this.setAttribute(
			"position",
			new BufferAttribute(geoInfo.attributes.position.value, geoInfo.attributes.position.size),
		);
		this.setAttribute(
			"uv",
			new BufferAttribute(geoInfo.attributes.texcoord.value, geoInfo.attributes.texcoord.size),
		);
		if (geoInfo.attributes.normal) {
			this.setAttribute(
				"normal",
				new BufferAttribute(geoInfo.attributes.normal.value, geoInfo.attributes.normal.size),
			);
		}

		this.computeBoundingBox();
		this.computeBoundingSphere();
		return this;
	}
}
