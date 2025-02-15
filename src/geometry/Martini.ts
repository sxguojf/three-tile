export class Martini {
	gridSize: number;
	numTriangles = 0;
	numParentTriangles = 0;
	indices: Uint32Array;
	coords: Uint16Array;
	uv: Uint16Array;

	constructor(gridSize = 257) {
		this.gridSize = gridSize;
		const tileSize = gridSize - 1;
		// 网格大小必须是2^n+1，很奇怪的判断方式
		if (tileSize & (tileSize - 1)) {
			throw new Error(`Expected grid size to be 2^n+1, got ${gridSize}.`);
		}

		this.numTriangles = tileSize * tileSize * 2 - 2;
		this.numParentTriangles = this.numTriangles - tileSize * tileSize;

		this.indices = new Uint32Array(this.gridSize * this.gridSize);
		this.coords = new Uint16Array(this.numTriangles * 4);
		this.uv = new Uint16Array(this.numTriangles * 2);

		// 从隐式二叉树中的索引获取三角形坐标 get triangle coordinates from its index in an implicit binary tree
		for (let i = 0; i < this.numTriangles; i++) {
			let id = i + 2;
			let ax = 0,
				ay = 0,
				bx = 0,
				by = 0,
				cx = 0,
				cy = 0;
			// 奇数:true,偶数:false
			if (id & 1) {
				bx = by = cx = tileSize; // 左下角，bottom-left triangle
			} else {
				ax = ay = cy = tileSize; // 右上角 top-right triangle
			}
			while ((id >>= 1) > 1) {
				// 计算中间点坐标
				const mx = (ax + bx) >> 1;
				const my = (ay + by) >> 1;

				if (id & 1) {
					// left half
					bx = ax;
					by = ay;
					ax = cx;
					ay = cy;
				} else {
					// right half
					ax = bx;
					ay = by;
					bx = cx;
					by = cy;
				}
				cx = mx;
				cy = my;
			}
			const k = i * 4;
			this.coords[k + 0] = ax;
			this.coords[k + 1] = ay;
			this.coords[k + 2] = bx;
			this.coords[k + 3] = by;
		}
	}

	createTile(terrain: ArrayLike<number>) {
		return new Tile(terrain, this);
	}
}

class Tile {
	terrain: ArrayLike<number>;
	martini: Martini;
	errors: Float32Array;
	constructor(terrain: ArrayLike<number>, martini: Martini) {
		const size = martini.gridSize;
		if (terrain.length !== size * size)
			throw new Error(
				`Expected terrain data of length ${size * size} (${size} x ${size}), got ${terrain.length}.`,
			);

		this.terrain = terrain;
		this.martini = martini;
		this.errors = new Float32Array(terrain.length);
		this.update();
	}

	update() {
		const { numTriangles, numParentTriangles, coords, gridSize: size } = this.martini;
		const { terrain, errors } = this;

		// 从最小的级别开始迭代所有可能的三角形 iterate over all possible triangles, starting from the smallest level
		for (let i = numTriangles - 1; i >= 0; i--) {
			const k = i * 4;
			const ax = coords[k + 0];
			const ay = coords[k + 1];
			const bx = coords[k + 2];
			const by = coords[k + 3];
			const mx = (ax + bx) >> 1;
			const my = (ay + by) >> 1;
			const cx = mx + my - ay;
			const cy = my + ax - mx;

			// 计算三角形长边中间的误差 calculate error in the middle of the long edge of the triangle
			const interpolatedHeight = (terrain[ay * size + ax] + terrain[by * size + bx]) / 2;
			const middleIndex = my * size + mx;
			const middleError = Math.abs(interpolatedHeight - terrain[middleIndex]);

			errors[middleIndex] = Math.max(errors[middleIndex], middleError);

			if (i < numParentTriangles) {
				// 更大的三角形;子级的累积错误 bigger triangles; accumulate error with children
				const leftChildIndex = ((ay + cy) >> 1) * size + ((ax + cx) >> 1);
				const rightChildIndex = ((by + cy) >> 1) * size + ((bx + cx) >> 1);
				errors[middleIndex] = Math.max(errors[middleIndex], errors[leftChildIndex], errors[rightChildIndex]);
			}
		}
	}

	getMesh(maxError = 0) {
		const { gridSize: size, indices } = this.martini;
		const { errors } = this;
		let numVertices = 0;
		let numTriangles = 0;
		const max = size - 1;

		// use an index grid to keep track of vertices that were already used to avoid duplication
		// 使用索引网格来跟踪已使用的顶点，以避免重复
		indices.fill(0);

		// 取得mesh 通过两个阶段，两阶段都遍历地图误差 retrieve mesh in two stages that both traverse the error map:
		// - countElements: 查找要使用的顶点（并为每个顶点分配一个索引）和三角形数量（用于最小分配）find used vertices (and assign each an index), and count triangles (for minimum allocation)
		// - processTriangle: 填充分配的顶点和三角形类型化数组 fill the allocated vertices & triangles typed arrays

		/**
		 * 计算给定三角形中元素的数量
		 *
		 * @param ax 第一个点的x坐标
		 * @param ay 第一个点的y坐标
		 * @param bx 第二个点的x坐标
		 * @param by 第二个点的y坐标
		 * @param cx 第三个点的x坐标
		 * @param cy 第三个点的y坐标
		 */
		function countElements(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
			// 中点
			const mx = (ax + bx) >> 1;
			const my = (ay + by) >> 1;

			// 误差大于maxError，再次细分
			if (Math.abs(ax - cx) + Math.abs(ay - cy) > 1 && errors[my * size + mx] > maxError) {
				countElements(cx, cy, ax, ay, mx, my);
				countElements(bx, by, cx, cy, mx, my);
			} else {
				indices[ay * size + ax] = indices[ay * size + ax] || ++numVertices;
				indices[by * size + bx] = indices[by * size + bx] || ++numVertices;
				indices[cy * size + cx] = indices[cy * size + cx] || ++numVertices;
				numTriangles++;
			}
		}
		// 计算右上三角形
		countElements(0, 0, max, max, max, 0);
		// 计算左下三角形
		countElements(max, max, 0, 0, 0, max);

		const vertices = new Float32Array(numVertices * 2);
		const triangles = new Uint32Array(numTriangles * 3);
		let triIndex = 0;

		/**
		 * 处理三角形，用于网格细化
		 *
		 * @param ax 第一个顶点的x坐标
		 * @param ay 第一个顶点的y坐标
		 * @param bx 第二个顶点的x坐标
		 * @param by 第二个顶点的y坐标
		 * @param cx 第三个顶点的x坐标
		 * @param cy 第三个顶点的y坐标
		 */
		function processTriangle(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
			const mx = (ax + bx) >> 1;
			const my = (ay + by) >> 1;

			// 误差大于maxError，再次细分
			if (Math.abs(ax - cx) + Math.abs(ay - cy) > 1 && errors[my * size + mx] > maxError) {
				// 三角形不能很好地近似表面;进一步向下钻取 triangle doesn't approximate the surface well enough; drill down further
				processTriangle(cx, cy, ax, ay, mx, my);
				processTriangle(bx, by, cx, cy, mx, my);
			} else {
				// add a triangle
				const a = indices[ay * size + ax] - 1;
				const b = indices[by * size + bx] - 1;
				const c = indices[cy * size + cx] - 1;

				vertices[2 * a] = ax;
				vertices[2 * a + 1] = ay;

				vertices[2 * b] = bx;
				vertices[2 * b + 1] = by;

				vertices[2 * c] = cx;
				vertices[2 * c + 1] = cy;

				triangles[triIndex++] = a;
				triangles[triIndex++] = b;
				triangles[triIndex++] = c;
			}
		}
		// 处理右上三角形
		processTriangle(0, 0, max, max, max, 0);
		// 处理左下三角形
		processTriangle(max, max, 0, 0, 0, max);

		return { vertices, triangles };
	}
}
