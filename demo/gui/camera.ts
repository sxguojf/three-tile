import { Vector3 } from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import TWEEN, { Tween } from "three/examples/jsm/libs/tween.module.js";
import * as tt from "../../src";

export const createCameraGui = (gui: GUI, viewer: tt.plugin.GLViewer, map: tt.TileMap) => {
	/**
	 * 飞行到某世界坐标
	 * @param cameraPos 目标摄像机世界坐标
	 * @param centerPos 目标地图中心坐标
	 */
	const flyToPos = (cameraPos: Vector3, centerPos: Vector3) => {
		viewer.controls.target.copy(centerPos);
		const start = viewer.camera.position;
		new TWEEN.Tween(start)
			// 先到10000km高空
			.to({ y: 10000, z: 0 }, 500)
			// 再到目标位置
			.chain(new Tween(start).to(cameraPos))
			.start();
	};

	/**
	 * 飞行到某地理坐标
	 * @param newCameraGeo 目标摄像机经纬度坐标
	 * @param newcenterGeo 目标地图中心经纬度坐标
	 */
	const flyToGeo = (newCameraGeo: Vector3, newcenterGeo: Vector3) => {
		const cameraPosition = getPos(newCameraGeo);
		const centerPosition = getPos(newcenterGeo);
		flyToPos(cameraPosition, centerPosition);
	};

	const getGeo = (pos: Vector3) => {
		return map.pos2geo(map.worldToLocal(pos.clone()));
	};

	const getPos = (geo: Vector3) => {
		return map.localToWorld(map.geo2pos(geo));
	};

	const vm = {
		restCamera: () => {
			flyToGeo(new Vector3(110, -10, 4000), new Vector3(110, 30, 0));
		},
		toBeiJing: () => {
			const g1 = new Vector3(116.39199596764485, 39.91047669278009, 0.8982447706283121);
			const g2 = new Vector3(116.39180280130437, 39.915285657622775, 0);
			flyToGeo(g1, g2);
		},
		toYanan: () => {
			const g1 = new Vector3(109.49353372381903, 36.59636418262586, 3.3572026657301923);
			const g2 = new Vector3(109.49500701539671, 36.6218368088748, 0);
			flyToGeo(g1, g2);
		},
		toQomolangma: () => {
			const g1 = new Vector3(86.80606589682316, 27.95599784430085, 8.632029116020213);
			const g2 = new Vector3(86.94920793640907, 27.97634961375401, 0);
			flyToGeo(g1, g2);
		},
		toTaiBaiShan: () => {
			const g1 = new Vector3(107.81217986540818, 34.02513971165077, 6.048197106231797);
			const g2 = new Vector3(107.7612653393517, 33.98143120559124, 0);
			flyToGeo(g1, g2);
		},
		toHuaShan: () => {
			const g1 = new Vector3(110.0971156415985, 34.57775144132326, 5.7782429087774245);
			const g2 = new Vector3(110.06942930220872, 34.510265895992404, 0);
			flyToGeo(g1, g2);
		},
		toHuangShan: () => {
			const g1 = new Vector3(118.20015977025946, 30.06770300827729, 2.610548923662593);
			const g2 = new Vector3(118.18812519546589, 30.099295710163304, 0);
			flyToGeo(g1, g2);
		},
		toTaiShan: () => {
			const g1 = new Vector3(117.10289638118692, 36.19675384399952, 1.6517273521123468);
			const g2 = new Vector3(117.10207227084261, 36.220267343404004, 0);
			flyToGeo(g1, g2);
		},
		toUluru: () => {
			const g1 = new Vector3(131.01972109578136, -25.34644783404596, 1.0185954608775432);
			const g2 = new Vector3(131.03497059727212, -25.346617629956928, 0);
			flyToGeo(g1, g2);
		},
		toFuji: () => {
			const g1 = new Vector3(138.7168714361765, 35.293034242886165, 4.138178498736728);
			const g2 = new Vector3(138.73205716638114, 35.35132576846971, 0);
			flyToGeo(g1, g2);
		},
		toNewyork: () => {
			const g1 = new Vector3(-74.00824629593717, 40.697098959649566, 1.6554257243613275);
			const g2 = new Vector3(-74.007744759308, 40.70653413033989, 0);
			flyToGeo(g1, g2);
		},
		toHome: () => {
			const g1 = new Vector3(108.94232215761177, 34.2582357530813, 0.7844306648412458);
			const g2 = new Vector3(108.94250888147981, 34.26353272269615, 0);
			flyToGeo(g1, g2);
		},
		toSchool: () => {
			const g1 = new Vector3(126.67728818317335, 45.760602873759076, 0.7902206445893154);
			const g2 = new Vector3(126.6785723085352, 45.755608565175756, 0);
			flyToGeo(g1, g2);
		},
		CameraInfoToConsole: () => {
			const cameraGeo = getGeo(viewer.camera.getWorldPosition(new Vector3()));
			const targetGeo = getGeo(viewer.controls.target);
			const code = `
()=>{
	const camera = new Vector3(${cameraGeo.x},${cameraGeo.y},${cameraGeo.z})
	const center = new Vector3(${targetGeo.x},${targetGeo.y},${targetGeo.z})
	flyToGeo(camera,center);
}
			`;
			navigator.clipboard.writeText(code);
			console.log("-----------------------------------------------------------------------------------------");
			console.log(code);
			console.log("-----------------------------------------------------------------------------------------");
			console.log("Code has copide to clipboard");
		},
	};

	const folder = gui.addFolder("Camera position");

	folder.add(vm, "restCamera").name("Reset");
	folder.add(vm, "CameraInfoToConsole");
	folder.add(vm, "toHome");
	folder.add(vm, "toSchool");
	folder.add(vm, "toBeiJing");
	folder.add(vm, "toYanan");
	folder.add(vm, "toQomolangma");
	folder.add(vm, "toTaiBaiShan");
	folder.add(vm, "toHuaShan");
	folder.add(vm, "toHuangShan");
	folder.add(vm, "toTaiShan");
	folder.add(vm, "toFuji");
	folder.add(vm, "toUluru");
	folder.add(vm, "toNewyork");
};
