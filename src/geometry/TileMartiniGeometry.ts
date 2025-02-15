/**
 *@description: Martini geomety with skrit
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferAttribute, PlaneGeometry, Vector3 } from "three";
import { Martini } from "./Martini";

/**
 * create geomety from rules grid dem and it has a skrit
 */
export class TileMartiniGeometry extends PlaneGeometry {
	private _min = 0;

	/**
	 * Build grid geometry from dem
	 * @param dem 2d array of dem
	 * @param tileSize tile size
	 */
	protected build(dem: ArrayLike<number>, tileSize: number) {
		this.dispose();
		const martini = new Martini(tileSize + 1);
		const tile = martini.createTile(dem);
		const mesh = tile.getMesh(1);

		const indices = new Uint32Array(mesh.vertices.length);
		for (let i = 0; i < indices.length; i++) {
			indices[i] = i;
		}

		const vertices = new Float32Array(mesh.vertices.length);
		for (let i = 0; i < vertices.length; i++) {
			vertices[i] = mesh.vertices[i] / tileSize;
		}

		this.setIndex(new BufferAttribute(indices, 1));
		this.setAttribute("position", new BufferAttribute(mesh.vertices, 3));
		// this.setAttribute("normal", new Float16BufferAttribute(new Float32Array(numVertices * 3), 3));
		// this.setAttribute("uv", new BufferAttribute(uvs, 2));

		return this;
	}

	/**
	 * set the tile dem data
	 * @param dem 2d dem array
	 * @param tileSize dem size
	 * @returns this
	 */
	public setData(dem: ArrayLike<number>) {
		const tileSize = Math.floor(Math.sqrt(dem.length));
		this.build(dem, tileSize);
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

					// 三个点中有一个点在边缘，重置法向量
					if (pA.z < this._min || pB.z < this._min || pC.z < this._min) {
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
