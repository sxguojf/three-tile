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
	// 取得Geometry数据
	const geoData = tile.getGeometryData(maxError);
	// 添加裙边
	const mesh = addSkirt(geoData.attributes, geoData.indices, 1);
	return mesh;
}
