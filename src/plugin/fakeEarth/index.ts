/**
 *@description: Fake Earth
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Color, Scene } from "three";
import { TileMap } from "../../map";
import { BasePlugin } from "../PluginSDK";
import { FakeEarth } from "./FakeEarth";
import { MapControls } from "three/examples/jsm/controls/MapControls";

export { EarthMaskMaterial } from "./EarthMaskMaterial";
export { FakeEarth } from "./FakeEarth";

export type FrakeEarthOptions = {
	map: TileMap;
	scene: Scene;
	controls: MapControls;
};

class FrakeEarthPlugin extends BasePlugin {
	protected doInstall(options: FrakeEarthOptions): void {
		const { map, scene, controls } = options;
		const fakeEarth = new FakeEarth(scene.fog?.color || new Color(0));
		fakeEarth.name = "fakeearth";
		fakeEarth.applyMatrix4(map.rootTile.matrix);
		map.add(fakeEarth);

		controls.addEventListener("change", () => {
			// 地图距摄像机较远时再显示遮罩
			fakeEarth.visible = controls.getDistance() > 3000;
		});
	}
}

export const frakEarth = new FrakeEarthPlugin();

// declare module "../../map" {
// 	interface TileMap {
// 		test(): void;
// 	}
// }

// TileMap.prototype.test = () => {
// 	console.log("this is a test");
// };
