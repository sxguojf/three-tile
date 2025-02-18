import { Martini } from "./Martini";
import { addSkirt } from "./skirt";

// worker.ts
self.onmessage = (event: MessageEvent) => {
	const mesh = parse(event.data.dem, event.data.z);
	// 将结果发送回主线程
	self.postMessage(mesh);
	self.close();
};

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

/**
 * 解析高程数据并生成网格模型
 *
 * @param dem 高程数据，Float32Array类型
 * @param z 缩放级别
 * @returns 包含顶点索引和属性的对象
 */
function parse(dem: Float32Array, z: number) {
	// 计算网格大小
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

	// 添加裙边
	const geoInfo = addSkirt(attributes, triangles, 1);

	return {
		indices: geoInfo.triangles,
		attributes: geoInfo.attributes,
		skirtIndex: vertices.length,
	};
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
function getMeshAttributes(vertices: Uint16Array, terrain: Float32Array) {
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
