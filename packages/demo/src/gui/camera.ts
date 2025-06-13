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
	const flyToGeo = async (newCameraGeo: Vector3, newcenterGeo: Vector3) => {
		const cameraPosition = map.geo2world(newCameraGeo);
		const centerPosition = map.geo2world(newcenterGeo);
		map.autoUpdate = false;
		await viewer.flyTo(centerPosition, cameraPosition);
		map.autoUpdate = true;
	};

	const vm = {
		resetCamera: () => {
			flyToGeo(new Vector3(110, -10, 4000 * 1000), new Vector3(110, 30, 0));
		},
		toBeiJing: () => {
			const g1 = new Vector3(116.39199596764485, 39.91047669278009, 1000);
			const g2 = new Vector3(116.39180280130437, 39.915285657622775, 0);
			flyToGeo(g1, g2);
		},
		toYanan: () => {
			const camera = new Vector3(109.48543504270644, 36.59146704194476, 1612.4168502501655);
			const center = new Vector3(109.49721492409648, 36.613511416979144, 2587.750541118096e-16);
			flyToGeo(camera, center);
		},
		toQomolangma: () => {
			const g1 = new Vector3(86.80606589682316, 27.95599784430085, 8632.029116020213);
			const g2 = new Vector3(86.94920793640907, 27.97634961375401, 0);
			flyToGeo(g1, g2);
		},
		toTaiBaiShan: () => {
			const camera = new Vector3(107.83112070637517, 34.025426010356576, 5975.849209767802);
			const center = new Vector3(107.76416702572577, 33.97857186381407, 0);
			flyToGeo(camera, center);
		},
		toHuaShan: () => {
			const g1 = new Vector3(110.0971156415985, 34.57775144132326, 5778.2429087774245);
			const g2 = new Vector3(110.06942930220872, 34.510265895992404, 0);
			flyToGeo(g1, g2);
		},
		toHuangShan: () => {
			const g1 = new Vector3(118.20015977025946, 30.06770300827729, 2610.548923662593);
			const g2 = new Vector3(118.18812519546589, 30.099295710163304, 0);
			flyToGeo(g1, g2);
		},
		toTaiShan: () => {
			const g1 = new Vector3(117.10289638118692, 36.19675384399952, 1651.7273521123468);
			const g2 = new Vector3(117.10207227084261, 36.220267343404004, 0);
			flyToGeo(g1, g2);
		},
		toUluru: () => {
			const g1 = new Vector3(131.01972109578136, -25.34644783404596, 1018.5954608775432);
			const g2 = new Vector3(131.03497059727212, -25.346617629956928, 0);
			flyToGeo(g1, g2);
		},
		toFuji: () => {
			const g1 = new Vector3(138.7168714361765, 35.293034242886165, 4138.178498736728);
			const g2 = new Vector3(138.73205716638114, 35.35132576846971, 0);
			flyToGeo(g1, g2);
		},
		toNewyork: () => {
			const g1 = new Vector3(-74.00824629593717, 40.697098959649566, 1655.4257243613275);
			const g2 = new Vector3(-74.007744759308, 40.70653413033989, 0);
			flyToGeo(g1, g2);
		},
		toHome: () => {
			const g1 = new Vector3(108.94232215761177, 34.2582357530813, 784.4306648412458);
			const g2 = new Vector3(108.94250888147981, 34.26353272269615, 0);
			flyToGeo(g1, g2);
		},
		toSchool: () => {
			const camera = new Vector3(126.62063809151746, 45.7424339643477, 807.9759367520237);
			const center = new Vector3(126.62495629765102, 45.7399914201275, 0);
			flyToGeo(camera, center);
		},

		toQinLing: () => {
			const camera = new Vector3(108.87132772172248, 34.08895431019487, 3788.798936941705);
			const center = new Vector3(108.83132919921506, 34.044274358763154, 2.8677996230582546e-11);
			flyToGeo(camera, center);
		},

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

	const folder = gui.addFolder("地点（控制摄像机）");

	folder.add(vm, "resetCamera").name("复位");
	folder.add(vm, "cameraHelper").name("相机辅助线");
	folder.add(vm, "cameraInfoToConsole").name("输出相机位置");
	folder.add(vm, "toHome").name("西安");
	folder.add(vm, "toSchool").name("学校");
	folder.add(vm, "toBeiJing").name("北京");
	folder.add(vm, "toYanan").name("延安");
	folder.add(vm, "toQinLing").name("秦岭");
	folder.add(vm, "toQomolangma").name("珠穆朗玛峰");
	folder.add(vm, "toTaiBaiShan").name("太白山");
	folder.add(vm, "toHuaShan").name("华山");
	folder.add(vm, "toHuangShan").name("黄山");
	folder.add(vm, "toTaiShan").name("泰山");
	folder.add(vm, "toFuji").name("富士山");
	folder.add(vm, "toUluru").name("乌鲁鲁");
	folder.add(vm, "toNewyork").name("纽约");
	// folder.add(vm, "toHME");
};
