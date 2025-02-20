import { addSkirt } from "./skirt";

export function getGeometryInfoFromDem(dem: Float32Array<ArrayBuffer>, skirt: boolean = true) {
	const size = Math.floor(Math.sqrt(dem.length));
	const width = size;
	const height = size;
	const numVertices = width * height;
	const numIndices = 6 * (width - 1) * (height - 1);

	// Initialize arrays for vertices, UVs, indices
	const vertices = new Float32Array(numVertices * 3);
	const uvs = new Float32Array(numVertices * 2);
	const indices = new Uint16Array(numIndices);

	let index = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			vertices[index * 3] = x / (width - 1) - 0.5;
			vertices[index * 3 + 1] = y / (height - 1) - 0.5;
			vertices[index * 3 + 2] = dem[(height - y - 1) * width + x];

			// Set UV coordinate
			uvs[index * 2] = vertices[index * 3] + 0.5;
			uvs[index * 2 + 1] = vertices[index * 3 + 1] + 0.5;

			index++;
		}
	}

	index = 0;
	for (let y = 0; y < height - 1; y++) {
		for (let x = 0; x < width - 1; x++) {
			const a = y * width + x;
			const b = a + 1;
			const c = a + width;
			const d = c + 1;

			// Two triangles per quad
			indices[index * 6] = a;
			indices[index * 6 + 1] = b;
			indices[index * 6 + 2] = c;

			indices[index * 6 + 3] = c;
			indices[index * 6 + 4] = b;
			indices[index * 6 + 5] = d;

			index++;
		}
	}

	// // 构建Martin
	// const martini = new Martini(gridSize);
	// // 简化
	// const tile = martini.createTile(dem);
	// // 几何误差
	// const maxError = maxErrors[z] / 1000 || 0;
	// // 取得顶点和索引
	// const { vertices, triangles } = tile.getMesh(maxError);

	// // 取得属性
	// const attributes = getMeshAttributes(vertices, dem);
	const attributes = {
		position: { value: vertices, size: 3 },
		texcoord: { value: uvs, size: 2 },
	};

	if (skirt) {
		// 添加裙边
		const geoInfo = addSkirt(attributes, indices, 1);
		return {
			indices: geoInfo.triangles,
			attributes: geoInfo.attributes,
			skirtIndex: numVertices,
		};
	} else {
		return {
			indices: indices,
			attributes: attributes,
			skirtIndex: numVertices,
		};
	}
}
