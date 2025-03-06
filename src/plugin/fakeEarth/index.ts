/**
 *@description: Fake Earth
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Color, ColorRepresentation } from "three";
import { TileMap } from "../../map";
import { FakeEarth } from "./FakeEarth";

export { EarthMaskMaterial } from "./EarthMaskMaterial";
export { FakeEarth } from "./FakeEarth";

declare module "../../map" {
	interface TileMap {
		createFrakEarth(bkColor?: ColorRepresentation, airColor?: ColorRepresentation): FakeEarth;
	}
}
// 扩展TileMap类，原型链上添加addFrakEarth方法
TileMap.prototype.createFrakEarth = function (
	bkColor: ColorRepresentation = 0xdbf0ff,
	airColor: ColorRepresentation = 0x6699cc,
): FakeEarth {
	const fakeEarth = new FakeEarth(new Color(bkColor), new Color(airColor));
	fakeEarth.name = "fakeearth";
	fakeEarth.applyMatrix4(this.rootTile.matrix);
	this.add(fakeEarth);
	return fakeEarth;
};
