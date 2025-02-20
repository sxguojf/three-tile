/**
 *@description: Martini geomety with skrit
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferAttribute, PlaneGeometry, Vector3 } from "three";

export type Attributes = {
	position: {
		value: Float32Array;
		size: number;
	};
	texcoord: {
		value: Float32Array;
		size: number;
	};
};

export type GeometryInfo = {
	attributes: Attributes;
	indices: Uint16Array | Uint32Array;
	skirtIndex?: number;
};

/**
 * create geomety from rules grid dem and it has a skrit
 */
export class TileMartiniGeometry extends PlaneGeometry {
	private _edgeIndex = -1;

	/**
	 * set the tile dem data
	 * @param geoInfo: any; 瓦片网格数据，包含position, uv, indices属性
	 * @returns this
	 */
	public setData(geoInfo: GeometryInfo) {
		// 包括裙边顶点在内的顶点数量
		this._edgeIndex = geoInfo.skirtIndex ?? -1;

		this.setIndex(new BufferAttribute(geoInfo.indices, 1));
		this.setAttribute(
			"position",
			new BufferAttribute(geoInfo.attributes.position.value, geoInfo.attributes.position.size),
		);
		this.setAttribute(
			"uv",
			new BufferAttribute(geoInfo.attributes.texcoord.value, geoInfo.attributes.texcoord.size),
		);
		this.setAttribute(
			"normal",
			new BufferAttribute(new Float32Array(geoInfo.attributes.position.value.length * 3), 3),
		);

		//计算顶点法向量
		this.computeVertexNormals();
		//修改顶点后必须重新计算包围矩形和包围球
		this.computeBoundingBox();
		this.computeBoundingSphere();
		return this;
	}

	// set normal on edge(skrit)
	// 瓦片边缘法向量计算比较复杂，需要根据相邻瓦片高程计算，暂未完美实现
	// 考虑使用Mapbox Terrain-DEM v1格式地形 https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-dem-v1/

	computeVertexNormals() {
		if (this._edgeIndex < 0) {
			return super.computeVertexNormals();
		}
		const index = this.index;
		const positionAttribute = this.getAttribute("position");

		if (positionAttribute !== undefined) {
			let normalAttribute = this.getAttribute("normal");
			if (normalAttribute === undefined) {
				normalAttribute = new BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
				this.setAttribute("normal", normalAttribute);
			} else {
				// reset existing normals to zero
				for (let i = 0, il = normalAttribute.count; i < il; i++) {
					normalAttribute.setXYZ(i, 0, 0, 0);
				}
			}

			const pA = new Vector3(),
				pB = new Vector3(),
				pC = new Vector3();
			const nA = new Vector3(),
				nB = new Vector3(),
				nC = new Vector3();
			const cb = new Vector3(),
				ab = new Vector3();

			// indexed elements
			if (index) {
				for (let i = 0, il = index.count; i < il; i += 3) {
					const vA = index.getX(i + 0);
					const vB = index.getX(i + 1);
					const vC = index.getX(i + 2);

					pA.fromBufferAttribute(positionAttribute, vA);
					pB.fromBufferAttribute(positionAttribute, vB);
					pC.fromBufferAttribute(positionAttribute, vC);

					if (i >= this._edgeIndex) {
						// 边缘顶点索引重置法向量
						normalAttribute.setXYZ(vA, 0, 0, 1);
						normalAttribute.setXYZ(vB, 0, 0, 1);
						normalAttribute.setXYZ(vC, 0, 0, 1);
					} else {
						cb.subVectors(pC, pB);
						ab.subVectors(pA, pB);
						cb.cross(ab);

						nA.fromBufferAttribute(normalAttribute, vA);
						nB.fromBufferAttribute(normalAttribute, vB);
						nC.fromBufferAttribute(normalAttribute, vC);

						nA.add(cb);
						nB.add(cb);
						nC.add(cb);

						normalAttribute.setXYZ(vA, nA.x, nA.y, nA.z);
						normalAttribute.setXYZ(vB, nB.x, nB.y, nB.z);
						normalAttribute.setXYZ(vC, nC.x, nC.y, nC.z);
					}
				}
			} else {
				// non-indexed elements (unconnected triangle soup)

				for (let i = 0, il = positionAttribute.count; i < il; i += 3) {
					pA.fromBufferAttribute(positionAttribute, i + 0);
					pB.fromBufferAttribute(positionAttribute, i + 1);
					pC.fromBufferAttribute(positionAttribute, i + 2);

					cb.subVectors(pC, pB);
					ab.subVectors(pA, pB);
					cb.cross(ab);

					normalAttribute.setXYZ(i + 0, cb.x, cb.y, cb.z);
					normalAttribute.setXYZ(i + 1, cb.x, cb.y, cb.z);
					normalAttribute.setXYZ(i + 2, cb.x, cb.y, cb.z);
				}
			}

			this.normalizeNormals();

			normalAttribute.needsUpdate = true;
		}
	}
}
