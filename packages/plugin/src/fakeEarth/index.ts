/**
 *@description: Fake Earth
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Color, ColorRepresentation } from "three";
import { TileMap } from "../tt";
import { FakeEarth } from "./FakeEarth";

export { EarthMaskMaterial } from "./EarthMaskMaterial";
export { FakeEarth };

export function createFrakEarth(
	map: TileMap,
	bkColor: ColorRepresentation = 0xdbf0ff,
	airColor: ColorRepresentation = 0x6699cc,
): FakeEarth {
	const fakeEarth = new FakeEarth(new Color(bkColor), new Color(airColor));
	fakeEarth.name = "fakeearth";
	fakeEarth.applyMatrix4(map.rootTile.matrix);
	return fakeEarth;
}
