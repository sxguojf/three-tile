// private _fogFactor = 1.0;
// 	public get fogFactor() {
// 		return this._fogFactor;
// 	}
// 	public set fogFactor(value) {
// 		this._fogFactor = value;
// 		this.controls.dispatchEvent({ type: "change" });
// 	}
// const polar = Math.max(controls.getPolarAngle(), 0.1);
// const dist = Math.max(controls.getDistance(), 0.1);
// if (this.scene.fog instanceof FogExp2) {
// 	this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.25;
// }

import { FogExp2, Scene } from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import { TileMap } from "../../map";

type AddFogParams = {
	scene: Scene;
	controls: MapControls;
};

declare module "../../map" {
	interface TileMap {
		addFog(params: AddFogParams): FogExp2;
	}
}

declare module "three" {
	interface FogExp2 {
		setFactor(factor: number): FogExp2;
		factor: number;
	}
}

// Object.defineProperty(FogExp2, "factor", {
// 	get() {
// 		return this.factor;
// 	},
// 	set(value: number) {
// 		this.factor = value;
// 		// controls.dispatchEvent({ type: "change" });
// 	},
// });

// 扩展TileMap类，原型链上添加addFrakEarth方法
TileMap.prototype.addFog = function (params: AddFogParams): FogExp2 {
	const { scene, controls } = params;
	controls.addEventListener("change", () => {
		const polar = Math.max(controls.getPolarAngle(), 0.1);
		const dist = Math.max(controls.getDistance(), 0.1);
		fog.density = (polar / (dist + 5)) * fog.factor * 0.25;
	});
	const fog = new FogExp2(0xdbf0ff, 0);
	fog.factor = 1.0;
	scene.fog = fog;
	return fog;
};
