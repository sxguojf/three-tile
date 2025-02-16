/**
 *@description: Martini geomety with skrit
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Float16BufferAttribute, Float32BufferAttribute, PlaneGeometry, Uint32BufferAttribute } from "three";
import { Martini } from "./Martini";
import { getMeshAttributes, getTerrain } from "./martiniUtils";

const maxErrors: { [key: number]: number } = {
	0: 10,
	1: 9,
	2: 8,
	3: 7,
	4: 6,
	5: 5,
	6: 3,
	7: 2,
	8: 1,
	9: 0.5,
	10: 0.2,
	11: 0.1,
	12: 0.05,
	13: 0.02,
	14: 0.01,
	15: 0.005,
	16: 0.002,
	17: 0.001,
	18: 0.0005,
	19: 0.0001,
	20: 0.0,
	21: 0.0,
	22: 0.0,
};

/**
 * create geomety from rules grid dem and it has a skrit
 */
export class TileMartiniGeometry extends PlaneGeometry {
	/**
	 * Build grid geometry from dem
	 * @param dem 2d array of dem
	 * @param tileSize tile size
	 */
	protected build(dem: Uint8ClampedArray, tileSize: number, z: number) {
		this.dispose();

		const martini = new Martini(tileSize + 1);
		const terrain = getTerrain(dem, tileSize);
		const tile = martini.createTile(terrain);
		const maxError = maxErrors[z] || 0;
		const { vertices, triangles } = tile.getMesh(maxError, false);

		const attributes = getMeshAttributes(vertices, terrain, tileSize);

		this.setIndex(new Uint32BufferAttribute(triangles, 1));
		this.setAttribute("position", new Float32BufferAttribute(attributes.position.value, attributes.position.size));
		this.setAttribute("normal", new Float16BufferAttribute(new Float32Array(vertices.length * 3), 3));
		this.setAttribute("uv", new Float32BufferAttribute(attributes.uv.value, attributes.uv.size));

		return this;
	}

	/**
	 * set the tile dem data
	 * @param dem 2d dem array
	 * @returns this
	 */
	public setData(imageData: Uint8ClampedArray, z: number) {
		const tileSize = Math.floor(Math.sqrt(imageData.length / 4));
		this.build(imageData, tileSize, z);
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

	// computeVertexNormals() {
	// 	const index = this.index;
	// 	const positionAttribute = this.getAttribute("position");

	// 	if (positionAttribute !== undefined) {
	// 		let normalAttribute = this.getAttribute("normal");
	// 		if (normalAttribute === undefined) {
	// 			normalAttribute = new BufferAttribute(new Float32Array(positionAttribute.count * 3), 3);
	// 			this.setAttribute("normal", normalAttribute);
	// 		} else {
	// 			// reset existing normals to zero
	// 			for (let i = 0, il = normalAttribute.count; i < il; i++) {
	// 				normalAttribute.setXYZ(i, 0, 0, 0);
	// 			}
	// 		}

	// 		const pA = new Vector3(),
	// 			pB = new Vector3(),
	// 			pC = new Vector3();
	// 		const nA = new Vector3(),
	// 			nB = new Vector3(),
	// 			nC = new Vector3();
	// 		const cb = new Vector3(),
	// 			ab = new Vector3();

	// 		// indexed elements

	// 		if (index) {
	// 			for (let i = 0, il = index.count; i < il; i += 3) {
	// 				const vA = index.getX(i + 0);
	// 				const vB = index.getX(i + 1);
	// 				const vC = index.getX(i + 2);

	// 				pA.fromBufferAttribute(positionAttribute, vA);
	// 				pB.fromBufferAttribute(positionAttribute, vB);
	// 				pC.fromBufferAttribute(positionAttribute, vC);

	// 				// 三个点中有一个点在边缘，重置法向量
	// 				if (pA.z < this._min || pB.z < this._min || pC.z < this._min) {
	// 					normalAttribute.setXYZ(vA, 0, 0, 1);
	// 					normalAttribute.setXYZ(vB, 0, 0, 1);
	// 					normalAttribute.setXYZ(vC, 0, 0, 1);
	// 				} else {
	// 					cb.subVectors(pC, pB);
	// 					ab.subVectors(pA, pB);
	// 					cb.cross(ab);

	// 					nA.fromBufferAttribute(normalAttribute, vA);
	// 					nB.fromBufferAttribute(normalAttribute, vB);
	// 					nC.fromBufferAttribute(normalAttribute, vC);

	// 					nA.add(cb);
	// 					nB.add(cb);
	// 					nC.add(cb);

	// 					normalAttribute.setXYZ(vA, nA.x, nA.y, nA.z);
	// 					normalAttribute.setXYZ(vB, nB.x, nB.y, nB.z);
	// 					normalAttribute.setXYZ(vC, nC.x, nC.y, nC.z);
	// 				}
	// 			}
	// 		} else {
	// 			// non-indexed elements (unconnected triangle soup)

	// 			for (let i = 0, il = positionAttribute.count; i < il; i += 3) {
	// 				pA.fromBufferAttribute(positionAttribute, i + 0);
	// 				pB.fromBufferAttribute(positionAttribute, i + 1);
	// 				pC.fromBufferAttribute(positionAttribute, i + 2);

	// 				cb.subVectors(pC, pB);
	// 				ab.subVectors(pA, pB);
	// 				cb.cross(ab);

	// 				normalAttribute.setXYZ(i + 0, cb.x, cb.y, cb.z);
	// 				normalAttribute.setXYZ(i + 1, cb.x, cb.y, cb.z);
	// 				normalAttribute.setXYZ(i + 2, cb.x, cb.y, cb.z);
	// 			}
	// 		}

	// 		this.normalizeNormals();

	// 		normalAttribute.needsUpdate = true;
	// 	}
	// }
}
