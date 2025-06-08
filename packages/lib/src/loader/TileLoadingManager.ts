import { LoadingManager, BufferGeometry } from "three";

export class TileLoadingManager extends LoadingManager {
	public onParseEnd?: (geometry: BufferGeometry) => void = undefined;

	public parseEnd(geometry: BufferGeometry) {
		this.onParseEnd && this.onParseEnd(geometry);
	}
}
