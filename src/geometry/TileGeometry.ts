/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferAttribute, BufferGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";
import { getGeometryDataFromDem } from "./utils";

/**
 * Inherit of PlaneGeometry, add setData and setDEM method
 */
export class TileGeometry extends BufferGeometry {
	public readonly type = "TileGeometry";

	/**
	 * set attribute data to geometry
	 * @param geometryData geometry data
	 * @returns this
	 */
	public setData(geometryData: GeometryDataType) {
		this.setIndex(new BufferAttribute(geometryData.indices, 1));
		const { attributes } = geometryData;
		this.setAttribute("position", new BufferAttribute(attributes.position.value, attributes.position.size));
		this.setAttribute("uv", new BufferAttribute(attributes.texcoord.value, attributes.texcoord.size));
		this.setAttribute("normal", new BufferAttribute(attributes.normal.value, attributes.normal.size));

		// 感觉加上这两句速度会快一点, 幻觉?
		this.computeBoundingBox();
		this.computeBoundingSphere();
		return this;
	}

	/**
	 * set DEM data to geometry
	 *
	 * @param dem Float32Array类型，表示地形高度图数据
	 * @returns 返回设置地形高度图数据后的对象
	 */
	public setDEM(dem: Float32Array) {
		const geoData = getGeometryDataFromDem(dem, true);
		return this.setData(geoData);
	}
}
