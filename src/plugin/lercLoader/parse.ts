import { getGeometryInfoFromDem } from "../../geometry";

export function parse(dem: Float32Array<ArrayBuffer>) {
	return getGeometryInfoFromDem(dem, true);
}
