import { BufferGeometry } from "three";
import { FileLoaderEx, ITileGeometryLoader, LoaderFactory } from "../../loader";
import { ISource } from "../../source";
import { TileQmGeometry } from "./TileQmGeometry";

// Cesium quantized-mesh tile loader
export class QuantizedMeshTileLoader implements ITileGeometryLoader {
	public readonly dataType = "quantized-mesh";

	private _useWorker = true;
	/** get use worker */
	public get useWorker() {
		return this._useWorker;
	}
	/** set use worker */
	public set useWorker(value: boolean) {
		this._useWorker = value;
	}

	// 图像加载器
	private fileLoader = new FileLoaderEx(LoaderFactory.manager);

	public constructor() {
		this.fileLoader.setResponseType("arraybuffer");
		// this.fileLoader.setRequestHeader({
		// 	// accept: "application/vnd.quantized-mesh,application/octet-stream;q=0.9,*/*;q=0.01",
		// 	// accept: "Accept: application/vnd.quantized-mesh,application/octet-stream;q=0.9",
		// 	// "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,fr;q=0.5",
		// 	authorization:
		// 		// "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOWEyODk0MS1lMDg5LTRjMTgtOGY4NC01YWVlMmQyZDM1NDUiLCJpZCI6MTE3MTM4LCJhc3NldElkIjoxLCJhc3NldHMiOnsiMSI6eyJ0eXBlIjoiVEVSUkFJTiIsInByZWZpeCI6IkNlc2l1bVdvcmxkVGVycmFpbi92MS4yIiwiZXh0ZW5zaW9ucyI6W3RydWUsdHJ1ZSx0cnVlXX19LCJzcmMiOiI3ZjQ5ZGUzNC1jNWYwLTQ1ZTMtYmNjYS05YTY4ZTVmN2I2MDkiLCJpYXQiOjE3Mzk1ODg2MTAsImV4cCI6MTczOTU5MjIxMH0.zBYqEyJfG998f8gnyaOA_5z3Sm5d7o9TF4TclBINHnU",
		// 		"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZjg5NmQzMi1lN2M3LTQxZTktOTAyYS01MDFkM2RjYTgyOGMiLCJpZCI6MzQ2NjgsImlhdCI6MTYwMDY4Mzg0OX0.vv0m2W-E8Vmi3VleFtwfTRBYdSoNdBCS-COnZVgN3Zc",
		// });
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
			onLoad();
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
