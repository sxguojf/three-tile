import { BufferGeometry } from "three";
import { FileLoaderEx, ITileGeometryLoader, LoaderFactory } from "../../loader";
import { ISource } from "../../source";
import { TileQmGeometry } from "./TileQmGeometry";

// Cesium quantized-mesh tile loader
export class QuantizedMeshTileLoader implements ITileGeometryLoader {
	public readonly dataType = "quantized-mesh";
	// 图像加载器
	private fileLoader = new FileLoaderEx(LoaderFactory.manager);

	public constructor() {
		this.fileLoader.setResponseType("arraybuffer");
	}

	load(
		source: ISource,
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): BufferGeometry {
		const url = source._getTileUrl(x, y, z);
		// const url = "./tiles/test1.terrain";
		// const url = x === 8 && y === 6 && z === 4 ? "./tiles/test1.terrain" : "";
		const geometry = new TileQmGeometry();
		if (!url) {
			setTimeout(onLoad);
			return geometry;
		} else {
			this.fileLoader.load(
				url,
				(data) => {
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
