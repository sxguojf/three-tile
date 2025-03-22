/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferAttribute, BufferGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";
import { getGeometryDataFromDem } from "./utils";
import { addSkirt } from "./skirt";

/**
 * Inherit of PlaneGeometry, add setData and setDEM method
 */
export class TileGeometry extends BufferGeometry {
	public readonly type = "TileGeometry";

	/**
	 * set attribute data to geometry
	 * @param data geometry data
	 * @returns this
	 */
	public setData(data: GeometryDataType | Float32Array) {
		if (data instanceof Float32Array) {
			data = getGeometryDataFromDem(data, true);
		}
		data = addSkirt(data.attributes, data.indices, 10);

		this.setIndex(new BufferAttribute(data.indices, 1));
		const { attributes } = data;
		this.setAttribute("position", new BufferAttribute(attributes.position.value, attributes.position.size));
		this.setAttribute("uv", new BufferAttribute(attributes.texcoord.value, attributes.texcoord.size));
		this.setAttribute("normal", new BufferAttribute(attributes.normal.value, attributes.normal.size));

		// 感觉加上这两句速度会快一点, 幻觉?
		this.computeBoundingBox();
		this.computeBoundingSphere();
		return this;
	}

	// /**
	//  * set DEM data to geometry
	//  *
	//  * @param dem Float32Array类型，表示地形高度图数据
	//  * @returns 返回设置地形高度图数据后的对象
	//  */
	// public setDEM(dem: Float32Array) {
	// 	let geoData = getGeometryDataFromDem(dem, true);
	// 	geoData = addSkirt(geoData.attributes, geoData.indices, 1);
	// 	return this.setData(geoData);
	// }
}
