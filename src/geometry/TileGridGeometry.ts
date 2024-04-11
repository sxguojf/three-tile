/**
 *@description: grid geomety has skrit
 *@author: Guojf
 *@date: 2023-04-06
 */

import { Float32BufferAttribute, MathUtils, PlaneGeometry, Vector3 } from "three";

/**
 * create geomety from rules grid dem and it has a skrit
 */
export class TileGridGeometry extends PlaneGeometry {
	private _min = Infinity;

	/**
	 * buile
	 * @param dem 2d array of dem
	 * @param tileSize tile size
	 */
	protected build(dem: ArrayLike<number>, tileSize: number) {
		this.dispose();
		const width = 1,
			height = 1,
			widthSegments = tileSize - 1,
			heightSegments = tileSize - 1;

		const width_half = width / 2;
		const height_half = height / 2;
		let gridX = Math.floor(widthSegments);
		let gridY = Math.floor(heightSegments);
		const segment_width = width / gridX;
		const segment_height = height / gridY;
		gridX += 2;
		gridY += 2;
		const gridX1 = gridX + 1;
		const gridY1 = gridY + 1;
		//
		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		let demIndex = 0;
		this._min = Math.min(...Array.from(dem));

		// uv
		for (let iy = 0; iy < gridY1; iy++) {
			for (let ix = 0; ix < gridX1; ix++) {
				let x = (ix - 1) * segment_width - width_half;
				let y = (iy - 1) * segment_height - height_half;
				let u = (ix - 1) / (gridX - 2);
				let v = 1 - (iy - 1) / (gridY - 2);

				x = MathUtils.clamp(x, -0.5, 0.5);
				y = MathUtils.clamp(y, -0.5, 0.5);
				u = MathUtils.clamp(u, 0, 1);
				v = MathUtils.clamp(v, 0, 1);

				let z = 0;
				// set min z when point on tile edge,else set real dem
				if (iy === 0 || iy === gridY1 - 1 || ix === 0 || ix === gridX1 - 1) {
					z = this._min - 0.1;
				} else {
					z = dem[demIndex];
					demIndex++;
				}

				// vertices
				vertices.push(x, -y, z);
				// normals
				normals.push(0, 0, 1);
				// uv
				uvs.push(u, v);
			}
		}

		// indices
		for (let iy = 0; iy < gridY; iy++) {
			for (let ix = 0; ix < gridX; ix++) {
				const a = ix + gridX1 * iy;
				const b = ix + gridX1 * (iy + 1);
				const c = ix + 1 + gridX1 * (iy + 1);
				const d = ix + 1 + gridX1 * iy;
				indices.push(a, b, d);
				indices.push(b, c, d);
			}
		}

		this.setIndex(indices);
		this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
		this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
		this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));

		return this;
	}

	/**
	 * set the tile dem data
	 * @param dem 2d dem array
	 * @param tileSize dem size
	 * @returns this
	 */
	public setData(dem: ArrayLike<number>, tileSize: number) {
		if (dem.length != tileSize * tileSize) {
			throw "DEM array size error!";
		}
		this.build(dem, tileSize);
		//修改顶点后必须重新计算包围矩形和包围球
		this.computeBoundingBox();
		this.computeBoundingSphere();
		this.computeVertexNormals();

		return this;
	}

	// set normal on edge(skirt)
	// 瓦片边缘法向量计算比较复杂，需要根据相邻瓦片高程计算，暂未实现
	// 考虑使用Mapbox Terrain-DEM v1格式地形 https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-dem-v1/
	public computeVertexNormals() {
		super.computeVertexNormals();

		const index = this.index;
		const positionAttribute = this.getAttribute("position");
		const normalAttribute = this.getAttribute("normal");

		const pA = new Vector3(),
			pB = new Vector3(),
			pC = new Vector3();

		const shkirtNormal = new Vector3(0, 0, 1);
		function setSkirtNormal(vA: number) {
			return normalAttribute.setXYZ(vA, shkirtNormal.x, shkirtNormal.y, shkirtNormal.z);
		}

		if (index) {
			for (let i = 0, il = index.count; i < il; i += 3) {
				// 取得一个三角形的三个顶点索引
				const vA = index.getX(i + 0);
				const vB = index.getX(i + 1);
				const vC = index.getX(i + 2);

				// 取出三个点的position
				pA.fromBufferAttribute(positionAttribute, vA);
				pB.fromBufferAttribute(positionAttribute, vB);
				pC.fromBufferAttribute(positionAttribute, vC);

				if (pA.z < this._min || pB.z < this._min || pC.z < this._min) {
					setSkirtNormal(vA);
					setSkirtNormal(vB);
					setSkirtNormal(vC);
				}
			}
		}
		normalAttribute.needsUpdate = true;
	}
}
