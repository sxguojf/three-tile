import { describe, it, expect } from "vitest";
import { getGeometryDataFromDem, getGridIndices, getNormals } from "./utils";

describe("getGeometryDataFromDem", () => {
	it("不带裙边的几何体", () => {
		const dem = new Float32Array([0, 1, 2, 3]); // 4 个顶点
		const result = getGeometryDataFromDem(dem, false);

		expect(result).toHaveProperty("attributes");
		expect(result).toHaveProperty("indices");
		expect(result.attributes.position.value).toHaveLength(12); // 一个顶点3个坐标 4*3
		expect(result.attributes.texcoord.value).toHaveLength(8); // 一个顶点2个纹理坐标 4*2
		expect(result.attributes.normal.value).toHaveLength(12); // 一个顶点3个法向量分量 4*3
		expect(result.indices).toHaveLength(6); // 2个三角形 2*3
	});

	it("带裙边的几何体", () => {
		const dem = new Float32Array([0, 1, 2, 3]);
		const result = getGeometryDataFromDem(dem, true);

		expect(result).toHaveProperty("attributes");
		expect(result).toHaveProperty("indices");
		expect(result.attributes.position.value).toHaveLength(36); // 4*3 vertices + 8*3 skirt vertices
		expect(result.attributes.texcoord.value).toHaveLength(24); // 4*2 uvs + 8*2 skirt uvs
		expect(result.attributes.normal.value).toHaveLength(36); // 12 normals + 8*3 skirt normals
		expect(result.indices).toHaveLength(30); // 6 indices + 24 skirt indices
	});

	it("空数据抛出异常", () => {
		const dem = new Float32Array([]);
		expect(() => getGeometryDataFromDem(dem, false)).toThrow(/must > 4/);
		expect(() => getGeometryDataFromDem(dem, true)).toThrow(/must > 4/);
	});

	describe("getGridIndices", () => {
		it("生成正确的网格索引数组", () => {
			const height = 3;
			const width = 3;
			const indices = getGridIndices(height, width);

			expect(indices).toHaveLength(24); // 2*2*6 = 24
			expect(indices).toEqual(
				new Uint16Array([0, 1, 3, 3, 1, 4, 1, 2, 4, 4, 2, 5, 3, 4, 6, 6, 4, 7, 4, 5, 7, 7, 5, 8]),
			);
		});

		it("处理最小网格", () => {
			const height = 2;
			const width = 2;
			const indices = getGridIndices(height, width);

			expect(indices).toHaveLength(6); // 1*1*6 = 6
			expect(indices).toEqual(new Uint16Array([0, 1, 2, 2, 1, 3]));
		});

		describe("getNormals", () => {
			it("计算正确的法向量", () => {
				const vertices = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0]);
				const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);
				const normals = getNormals(vertices, indices);

				expect(normals).toHaveLength(12); // 4 vertices * 3 components
				const ept = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
				for (let i = 0; i < vertices.length; i++) {
					expect(normals[i]).toBeCloseTo(ept[i]);
				}
			});

			it("处理没有法向量的情况", () => {
				const vertices = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
				const indices = new Uint16Array([0, 1, 2]);
				const normals = getNormals(vertices, indices);

				expect(normals).toHaveLength(9); // 3 vertices * 3 components
				expect(normals).toEqual(new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1]));
			});
		});
	});
});
