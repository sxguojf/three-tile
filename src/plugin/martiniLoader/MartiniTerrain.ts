// https://github.com/liuwo23/martini_terrain/blob/main/sources/Experience/Map/terrain.js

import * as THREE from "three";

export default class MartiniTerrain {
	gridSize: number;
	tileSize: number;
	terrainExagggeration: number;
	metersPerPixel: number;
	tileData: number[];
	terrain: number[];
	errors: Float32Array;
	tileCoord: [number, number, number][];
	martiniGeometry = new THREE.BufferGeometry();

	constructor(tileData: number[], tileSize = 256) {
		this.tileSize = tileSize;
		this.gridSize = tileSize + 1;

		this.terrainExagggeration = 4.5;
		this.metersPerPixel = 124.73948277849482;
		this.tileData = tileData;
		this.terrain = [];
		this.errors = new Float32Array();
		this.tileCoord = [];

		for (let i = 0; i < tileData.length; i++) {
			const x = i % this.tileSize;
			const y = Math.floor(i / this.tileSize);
			const z = tileData[i];
			this.tileCoord.push([x, y, z]);
		}

		this.init();
	}

	init() {
		this.decodeTerrain();
		this.initGeometry();
		this.computeError();
		this.updateGeometry(5);
	}

	initGeometry() {
		this.computeMetersPerPixel();
		const vertices = new Float32Array(this.gridSize * this.gridSize * 3);
		const indices = new Uint32Array(this.tileSize * this.tileSize * 6);
		let index = 0;

		for (let y = 0; y <= this.tileSize; y++) {
			for (let x = 0; x <= this.tileSize; x++) {
				const i = y * this.gridSize + x;
				vertices[3 * i + 0] = x / this.tileSize - 0.5;
				vertices[3 * i + 1] = 0.5 - y / this.tileSize;
				vertices[3 * i + 2] =
					(this.terrain[i] / this.metersPerPixel / this.tileSize) * this.terrainExagggeration;

				indices[index++] = i + 1;
				indices[index++] = i;
				indices[index++] = i + this.gridSize;
				indices[index++] = i + 1;
				indices[index++] = i + this.gridSize;
				indices[index++] = i + this.gridSize + 1;
			}
		}

		this.martiniGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
		this.martiniGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
		this.martiniGeometry.computeVertexNormals();
	}

	computeMetersPerPixel() {
		const [z, _x, y] = this.tileCoord[0];
		const numTiles = Math.pow(2, z);
		const lat = 2 * Math.atan(Math.exp((1 - (2 * (y + 0.5)) / numTiles) * Math.PI)) - Math.PI / 2;
		this.metersPerPixel = (40075016.7 * Math.cos(lat)) / numTiles / this.tileSize;
	}

	decodeTerrain() {
		this.terrain = this.tileData;
	}

	computeError() {
		const errorsArray = new Float32Array(this.gridSize * this.gridSize);
		const numSmallestTriangles = this.tileSize * this.tileSize;
		const numTriangles = numSmallestTriangles * 2 - 2;
		const lastLevelIndex = numTriangles - numSmallestTriangles;

		for (let i = numTriangles - 1; i >= 0; i--) {
			let id = i + 2;

			let ax = 0,
				ay = 0,
				bx = 0,
				by = 0,
				cx = 0,
				cy = 0;
			if (id & 1) {
				bx = by = cx = this.tileSize;
			} else {
				ax = ay = cy = this.tileSize;
			}

			while ((id >>= 1) > 1) {
				const mx = (ax + bx) >> 1;
				const my = (ay + by) >> 1;

				if (id & 1) {
					bx = ax;
					by = ay;
					ax = cx;
					ay = cy;
				} else {
					ax = bx;
					ay = by;
					bx = cx;
					by = cy;
				}

				cx = mx;
				cy = my;
			}
			const interpolateHeight =
				(this.terrain[ay * this.gridSize + ax] + this.terrain[by * this.gridSize + bx]) / 2;
			const middleIndex = ((ay + by) >> 1) * this.gridSize + ((ax + bx) >> 1);
			const middleError = Math.abs(interpolateHeight - this.terrain[middleIndex]);

			if (i >= lastLevelIndex) {
				errorsArray[middleIndex] = middleError;
			} else {
				const leftChildError = errorsArray[((ay + cy) >> 1) * this.gridSize + ((ax + cx) >> 1)];
				const rightChildError = errorsArray[((by + cy) >> 1) * this.gridSize + ((bx + cx) >> 1)];
				errorsArray[middleIndex] = Math.max(
					errorsArray[middleIndex],
					middleError,
					leftChildError,
					rightChildError,
				);
			}
		}

		this.errors = errorsArray;
	}

	updateGeometry(maxError: number) {
		let i = 0;
		if (this.martiniGeometry.index) {
			const indices = this.martiniGeometry.index.array as Uint32Array;
			const processTriangle = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => {
				const mx = (ax + bx) >> 1;
				const my = (ay + by) >> 1;
				if (Math.abs(ax - cx) + Math.abs(ay - cy) > 1 && this.errors[my * this.gridSize + mx] > maxError) {
					processTriangle(cx, cy, ax, ay, mx, my);
					processTriangle(bx, by, cx, cy, mx, my);
				} else {
					indices[i++] = ay * this.gridSize + ax;
					indices[i++] = by * this.gridSize + bx;
					indices[i++] = cy * this.gridSize + cx;
				}
			};

			processTriangle(0, 0, this.tileSize, this.tileSize, this.tileSize, 0);
			processTriangle(this.tileSize, this.tileSize, 0, 0, 0, this.tileSize);

			this.martiniGeometry.index.needsUpdate = true;
			this.martiniGeometry.setDrawRange(0, i);
		}
	}
}
