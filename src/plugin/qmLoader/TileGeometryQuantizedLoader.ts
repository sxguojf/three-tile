import { BufferAttribute, BufferGeometry, PlaneGeometry } from "three";
import { ITileGeometryLoader } from "../../loader";
import { QuantizedMeshData, QuantizedMeshLoader } from "./QuantizedMeshLoader";
import { ISource } from "../../source";

// 使用示例
export class QuantizedMeshTileLoader implements ITileGeometryLoader {
	public dataType = "quantized-mesh";
	private loader: QuantizedMeshLoader = new QuantizedMeshLoader();

	constructor() {}

	load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): BufferGeometry {
		const url = source._getTileUrl(x, y, z);
		const geometry = new PlaneGeometry();
		if (!url) {
			setTimeout(onLoad);
			return geometry;
		} else {
			this.loader.load(
				url,
				(meshData: QuantizedMeshData) => {
					this.setData(geometry, meshData);
					onLoad();
				},
				(_error) => {
					onLoad();
				},
				abortSignal,
			);

			return geometry;
		}
	}

	private setData(geometry: PlaneGeometry, meshData: QuantizedMeshData): BufferGeometry {
		// 设置顶点位置
		geometry.setAttribute("position", new BufferAttribute(meshData.vertexData.positions, 3));

		// 设置顶点高度
		geometry.setAttribute("height", new BufferAttribute(meshData.vertexData.heights, 1));

		// 设置索引
		geometry.setIndex(new BufferAttribute(meshData.indices, 1));

		// 计算法线
		geometry.computeVertexNormals();

		return geometry;
	}
}
