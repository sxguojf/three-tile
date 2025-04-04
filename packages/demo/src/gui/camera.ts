import { CameraHelper, Vector3 } from "three";
import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export const createCameraGui = (gui: GUI, viewer: plugin.GLViewer, map: tt.TileMap) => {
	/**
	 * 飞行到某地理坐标
	 * @param newCameraGeo 目标摄像机经纬度坐标
	 * @param newcenterGeo 目标地图中心经纬度坐标
	 */
	const flyToGeo = (newCameraGeo: Vector3, newcenterGeo: Vector3) => {
		const cameraPosition = map.geo2world(newCameraGeo);
		const centerPosition = map.geo2world(newcenterGeo);
		viewer.flyTo(centerPosition, cameraPosition);
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
			const camera = new Vector3(109.48543504270644, 36.59146704194476, 1.6124168502501655);
			const center = new Vector3(109.49721492409648, 36.613511416979144, 2.587750541118096e-16);
			flyToGeo(camera, center);
		},
		toQomolangma: () => {
			const g1 = new Vector3(86.80606589682316, 27.95599784430085, 8.632029116020213);
			const g2 = new Vector3(86.94920793640907, 27.97634961375401, 0);
			flyToGeo(g1, g2);
		},
		toTaiBaiShan: () => {
			const camera = new Vector3(107.83112070637517, 34.025426010356576, 5.975849209767802);
			const center = new Vector3(107.76416702572577, 33.97857186381407, 8.186888965509196e-17);
			flyToGeo(camera, center);
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
			const camera = new Vector3(126.62063809151746, 45.7424339643477, 0.8079759367520237);
			const center = new Vector3(126.62495629765102, 45.7399914201275, 9.6509323421991e-16);
			flyToGeo(camera, center);
		},
		// toHME: () => {
		// 	const camera = new Vector3(120.44694986586572, -29.169419011880095, 1.466339416442329);
		// 	const center = new Vector3(120.44854935362576, -29.15362549430602, 1.5315887252160664e-12);
		// 	flyToGeo(camera, center);
		// },

		cameraInfoToConsole: () => {
			const cameraGeo = map.world2geo(viewer.camera.getWorldPosition(new Vector3()));
			const targetGeo = map.world2geo(viewer.controls.target);
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

		cameraHelper: () => {
			if (cameraHelper) {
				viewer.scene.remove(cameraHelper);
			}
			cameraHelper = new CameraHelper(viewer.camera.clone());
			viewer.scene.add(cameraHelper);
		},
	};

	let cameraHelper: CameraHelper;

	const folder = gui.addFolder("Camera position");

	folder.add(vm, "restCamera").name("Reset");
	folder.add(vm, "cameraHelper");
	folder.add(vm, "cameraInfoToConsole");
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
	// folder.add(vm, "toHME");
};
