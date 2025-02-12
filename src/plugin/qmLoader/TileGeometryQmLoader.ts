import { BufferGeometry } from "three";
import { FileLoaderEx, ITileGeometryLoader, LoaderFactory } from "../../loader";
import { ISource } from "../../source";
import { TileQmGeometry } from "./TileQmGeometry";

// Cesium quantized-mesh tile loader
export class QuantizedMeshTileLoader implements ITileGeometryLoader {
	public dataType = "quantized-mesh";
	private loader: FileLoaderEx = new FileLoaderEx(LoaderFactory.manager);

	constructor() {
		this.loader.setResponseType("arraybuffer");
	}

	load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): BufferGeometry {
		// const url = source._getTileUrl(x, y, z);
		const url = "./tiles/test.terrain";
		const geometry = new TileQmGeometry();
		if (!url) {
			setTimeout(onLoad);
			return geometry;
		} else {
			this.loader.load(
				url,
				(data: ArrayBuffer) => {
					geometry.setData(data);
					onLoad();
				},
				undefined,
				(_error: any) => {
					onLoad();
				},
				abortSignal,
			);
			return geometry;
		}
	}
}

// const OLD_MIN = 0;
// const OLD_MAX = 32767;

// const NEW_MIN = 0;
// const NEW_MAX = 1;
// const changeRange = (value: number) => ((value - OLD_MIN) * (NEW_MAX - NEW_MIN)) / (OLD_MAX - OLD_MIN) + NEW_MIN;

// const loader = new FileLoaderEx(LoaderFactory.manager);
// loader.setResponseType("arraybuffer");
// loader.load("./tiles/test.terrain", (data: ArrayBuffer) => {
// 	console.log(data.byteLength);
// 	const meshData = decode(data);
// 	console.log(meshData);
// 	const geometry = new BufferGeometry();
// 	// 设置顶点位置
// 	if (meshData.vertexData) {
// 		const len = meshData.vertexData.length;
// 		const dataAsFloat32Array = new Float32Array(len);
// 		for (let i = 0; i < len; i += 3) {
// 			dataAsFloat32Array[i] = changeRange(meshData.vertexData[i]);
// 			dataAsFloat32Array[i + 1] = changeRange(meshData.vertexData[i + 1]);
// 			dataAsFloat32Array[i + 2] = (meshData.vertexData[i + 2] + meshData.header.minHeight) / 1000;
// 		}
// 		geometry.setAttribute("position", new BufferAttribute(new Float32Array(meshData.vertexData.buffer), 3));
// 	}

// 	// 设置索引
// 	meshData.triangleIndices && geometry.setIndex(new BufferAttribute(meshData.triangleIndices, 1));

// 	// 计算法线
// 	geometry.computeVertexNormals();
// });
