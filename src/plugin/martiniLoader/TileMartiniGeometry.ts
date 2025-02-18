/**
 *@description: Martini geomety with skrit
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferAttribute, PlaneGeometry, Vector3 } from "three";
import { Martini } from "./Martini";
import { addSkirt } from "./skirt";

const maxErrors: { [key: number]: number } = {
	0: 7000,
	1: 6000,
	2: 5000,
	3: 4000,
	4: 3000,
	5: 2500,
	6: 2000,
	7: 1500,
	8: 800,
	9: 500,
	10: 200,
	11: 100,
	12: 30,
	13: 12,
	14: 5,
	15: 2,
	16: 1,
	17: 0.5,
	18: 0.2,
	19: 0.1,
	20: 0.05,
};

/**
 * create geomety from rules grid dem and it has a skrit
 */
export class TileMartiniGeometry extends PlaneGeometry {
	private _edgeIndex = 0;
	/**
	 * Build grid geometry from dem
	 * @param dem 2d array of dem
	 * @param tileSize tile size
	 */
	protected build(dem: Float32Array, _x: number, _y: number, z: number) {
		this.dispose();
		const gridSize = Math.floor(Math.sqrt(dem.length));

		// 构建Martin
		const martini = new Martini(gridSize);
		// 简化
		const tile = martini.createTile(dem);
		// 几何误差
		const maxError = maxErrors[z] / 1000 || 0;
		// 取得顶点和索引
		const { vertices, triangles } = tile.getMesh(maxError);

		// 取得属性
		const attributes = getMeshAttributes(vertices, dem);

		// 记录不包括裙边顶点在内的顶点数量
		this._edgeIndex = attributes.position.value.length;

		// 添加裙边
		const { attributes: newAttributes, triangles: newTriangles } = addSkirt(attributes, triangles, 0.3);

		this.setIndex(new BufferAttribute(newTriangles as any, 1));
		this.setAttribute("position", new BufferAttribute(newAttributes.position.value, 3));
		this.setAttribute("uv", new BufferAttribute(newAttributes.texcoord.value, 2));
		this.setAttribute("normal", new BufferAttribute(new Float32Array(vertices.length * 3), 3));

		return this;
	}

	/**
	 * set the tile dem data
	 * @param dem 2d dem array
	 * @returns this
	 */
	public setData(imageData: Float32Array, x: number, y: number, z: number) {
		this.build(imageData, x, y, z);
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

/**
 * Get the attributes that compose the mesh.
 *
 * @param vertices - Vertices.
 * @param terrain  - Terrain
 * @param tileSize - Size of each tile.
 * @param bounds - Array with the bound of the map.
 * @param exageration - Vertical exageration of the map scale.
 * @returns The position and UV coordinates of the mesh.
 */
export function getMeshAttributes(vertices: Uint16Array, terrain: Float32Array) {
	const gridSize = Math.floor(Math.sqrt(terrain.length));
	const tileSize = gridSize - 1;
	const numOfVerticies = vertices.length / 2;

	// vec3. x, y in pixels, z in meters
	const positions = new Float32Array(numOfVerticies * 3);

	// vec2. 1 to 1 relationship with position. represents the uv on the texture image. 0,0 to 1,1.
	const texCoords = new Float32Array(numOfVerticies * 2);

	// 转换顶点坐标到-0.5到0.5之间，计算纹理坐标0-1之间
	for (let i = 0; i < numOfVerticies; i++) {
		const x = vertices[i * 2];
		const y = vertices[i * 2 + 1];
		const pixelIdx = y * gridSize + x;

		positions[3 * i + 0] = x / tileSize - 0.5;
		positions[3 * i + 1] = 0.5 - y / tileSize;
		positions[3 * i + 2] = terrain[pixelIdx];

		texCoords[2 * i + 0] = x / tileSize;
		texCoords[2 * i + 1] = 1 - y / tileSize;
	}

	return {
		position: { value: positions, size: 3 },
		texcoord: { value: texCoords, size: 2 },
	};
}
