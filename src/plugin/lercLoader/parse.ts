import { addSkirt, AttributesType, getNormals } from "../../geometry";
import { Martini } from "../../geometry/Martini";

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
	12: 40,
	13: 12,
	14: 5,
	15: 2,
	16: 1,
	17: 0.5,
	18: 0.2,
	19: 0.1,
	20: 0.05,
};

export function parse(data: { dem: Float32Array; width: number; height: number; z: number }) {
	const dem = data.dem;
	// 计算网格大小
	const gridSize = data.width;

	// 构建Martin
	const martini = new Martini(gridSize);
	// 简化
	const tile = martini.createTile(dem);
	// 几何误差
	const maxError = maxErrors[data.z] / 1000 || 0;
	// 取得顶点和索引
	const { vertices, triangles: indices } = tile.getMesh(maxError);
	// 取得属性
	const attributes = getMeshAttributes(dem, vertices, indices);
	// 添加裙边
	const mesh = addSkirt(attributes, indices, 1);
	return mesh;
}

function getMeshAttributes(
	terrain: Float32Array,
	vertices: Uint16Array,
	indices: Uint16Array | Uint32Array,
): AttributesType {
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

	const normals = getNormals(positions, indices);

	return {
		position: { value: positions, size: 3 },
		texcoord: { value: texCoords, size: 2 },
		normal: { value: normals, size: 3 },
	};
}
