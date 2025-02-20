import { addSkirt } from "../../geometry/skirt";

export function parse(imgData: ImageData) {
	const dem = Img2dem(imgData.data);

	const width = imgData.width;
	const height = imgData.height;
	const numVertices = width * height;
	const numIndices = 6 * (width - 1) * (height - 1);

	// Initialize arrays for vertices, UVs, indices
	const vertices = new Float32Array(numVertices * 3);
	const uvs = new Float32Array(numVertices * 2);
	const indices = new Uint16Array(numIndices);

	let index = 0;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			// Set vertex position (z is 0)
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

	// 添加裙边
	const geoInfo = addSkirt(attributes, indices, 1);

	return {
		indices: geoInfo.triangles,
		attributes: geoInfo.attributes,
		skirtIndex: numVertices,
	};
}

// RGB to dem (Mapbox Terrain-RGB v1)
// https://docs.mapbox.com/data/tilesets/reference/mapbox-terrain-rgb-v1/
function getZ(imgData: Uint8ClampedArray, i: number) {
	// 透明像素直接返回高度0
	if (imgData[i * 4 + 3] === 0) {
		return 0;
	}
	const rgb = (imgData[i * 4] << 16) | (imgData[i * 4 + 1] << 8) | imgData[i * 4 + 2];
	return rgb / 10000 - 10;
}

function Img2dem(imgData: Uint8ClampedArray) {
	const count = Math.floor(imgData.length / 4);
	const dem = new Float32Array(count);
	for (let i = 0; i < dem.length; i++) {
		dem[i] = getZ(imgData, i);
	}
	return dem;
}
