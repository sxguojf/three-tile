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

// class FrakeEarthPlugin extends BasePlugin {
// 	protected doInstall(options: FrakeEarthOptions): void {
// 		const { map, scene, controls } = options;
// 		const fakeEarth = new FakeEarth(scene.fog?.color || new Color(0));
// 		fakeEarth.name = "fakeearth";
// 		fakeEarth.applyMatrix4(map.rootTile.matrix);
// 		map.add(fakeEarth);

// 		controls.addEventListener("change", () => {
// 			// 地图距摄像机较远时再显示遮罩
// 			fakeEarth.visible = controls.getDistance() > 3000;
// 		});
// 	}
// }

// export const frakEarth = new FrakeEarthPlugin();

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
