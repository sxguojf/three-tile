// https://github.com/tentone/geo-three/blob/master/source/nodes/MapMartiniHeightNode.ts

/**
 * Get terrain points from image data.
 *
 * @param imageData - Terrain data encoded as image.
 * @param tileSize - Tile size.
 * @param elevation - Elevation scale (r, g, b, offset) object.
 * @returns The terrain elevation as a Float32 array.
 */
export function getTerrain(imageData: Uint8ClampedArray, tileSize: number): Float32Array {
	const gridSize = tileSize + 1;

	// From Martini demo
	// https://observablehq.com/@mourner/martin-real-time-rtin-terrain-mesh
	const terrain = new Float32Array(gridSize * gridSize);

	// Decode terrain values
	for (let i = 0, y = 0; y < tileSize; y++) {
		for (let x = 0; x < tileSize; x++, i++) {
			// 透明像素直接返回高度0
			if (imageData[i * 4 + 3] === 0) {
				terrain[i + y] = 0;
			}
			const k = i * 4;
			const r = imageData[k + 0];
			const g = imageData[k + 1];
			const b = imageData[k + 2];

			const rgb = (r << 16) | (g << 8) | b;
			terrain[i + y] = rgb / 10000 - 10;
		}
	}

	// Backfill bottom border
	for (let i = gridSize * (gridSize - 1), x = 0; x < gridSize - 1; x++, i++) {
		terrain[i] = terrain[i - gridSize];
	}

	// Backfill right border
	for (let i = gridSize - 1, y = 0; y < gridSize; y++, i += gridSize) {
		terrain[i] = terrain[i - 1];
	}

	return terrain;
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
export function getMeshAttributes(
	vertices: number[],
	terrain: Float32Array,
	tileSize: number,
): { position: { value: Float32Array; size: number }; uv: { value: Float32Array; size: number } } {
	const gridSize = tileSize + 1;
	const numOfVerticies = vertices.length / 2;

	// vec3. x, y in pixels, z in meters
	const positions = new Float32Array(numOfVerticies * 3);

	// vec2. 1 to 1 relationship with position. represents the uv on the texture image. 0,0 to 1,1.
	const texCoords = new Float32Array(numOfVerticies * 2);

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
		uv: { value: texCoords, size: 2 },
	};
}
