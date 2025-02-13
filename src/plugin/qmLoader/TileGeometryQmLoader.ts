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
		// const url = "./tiles/test1.terrain";
		const url = x === 8 && y === 6 && z === 4 ? "./tiles/test1.terrain" : "";

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

function sum(array: Uint8Array) {
	let s = 0;
	for (var i = 0; i < array.byteLength; i++) {
		s = s + array[i];
	}
	return s;
}
