import { CameraHelper, Vector3 } from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import TWEEN, { Tween } from "three/examples/jsm/libs/tween.module.js";
import * as tt from "../../src";

export const createCameraGui = (gui: GUI, viewer: tt.plugin.GLViewer) => {
	/**
	 * 飞行到某位置
	 * @param targetPosition 目标世界坐标
	 * @param controlsPositon 目标控制器焦点坐标
	 */
	const flyTo = (targetPosition: Vector3, controlsPositon: Vector3) => {
		viewer.controls.target.copy(controlsPositon);
		const cameraPos = viewer.camera.position;
		new TWEEN.Tween(cameraPos)
			// 先到10000km高空
			.to({ y: 0, z: 10000 }, 500)
			// 再到目标位置
			.chain(new Tween(cameraPos).to(targetPosition))
			.start();
	};

	const helper = new CameraHelper(viewer.camera.clone());
	helper.visible = false;
	viewer.scene.add(helper);

	const vm = {
		restCamera: () => {
			const targetPosition = new Vector3(1113.170996921898, -461.4370141679119, 3999.999999999999);
			const controlsPosition = new Vector3(1113.1709969219833, 3503.4745885626, -2.015115227743243e-147);
			flyTo(targetPosition, controlsPosition);
		},
		toBeiJing: () => {
			const targetPosition = new Vector3(2937.880446206417, 4852.837272434148, 0.8982447706293892);
			const controlsPosition = new Vector3(2937.8589434896376, 4853.535193447179, -4.179171171745043e-21);
			flyTo(targetPosition, controlsPosition);
		},
		toYanan: () => {
			const targetPosition = new Vector3(2169.9636368875927, 4382.899361611179, 3.357202665730798);
			const controlsPosition = new Vector3(2170.1276394330216, 4386.431762895977, -3.919158283214042e-16);
			flyTo(targetPosition, controlsPosition);
		},
		toQomolangma: () => {
			const targetPosition = new Vector3(-350.7904484068778, 3251.925523809779, 7.669686324170913);
			const controlsPosition = new Vector3(-340.03129805321583, 3242.083776300395, 4.1232869364468783e-16);
			flyTo(targetPosition, controlsPosition);
		},
		toTaiBai: () => {
			const targetPosition = new Vector3(1982.800201813011, 4032.091565236495, 6.048197106233053);
			const controlsPosition = new Vector3(1977.132544440199, 4026.222479546381, 3.1481138177319502e-18);
			flyTo(targetPosition, controlsPosition);
		},

		toHuaShan: () => {
			const targetPosition = new Vector3(2237.1526254014593, 4106.558071882356, 5.7782429087784895);
			const controlsPosition = new Vector3(2234.0706623994947, 4097.437786464135, 8.924989421922145e-17);
			flyTo(targetPosition, controlsPosition);
		},
		toHuangShan: () => {
			const targetPosition = new Vector3(3139.159996481894, 3512.179963938414, 2.610548923663056);
			const controlsPosition = new Vector3(3137.8203425198435, 3516.2442480350014, -4.050010631814304e-15);
			flyTo(targetPosition, controlsPosition);
		},
		toTaiShan: () => {
			const targetPosition = new Vector3(3017.0158184119055, 4327.635322127751, 1.6517273521133014);
			const controlsPosition = new Vector3(3016.924080838552, 4330.879272502904, -2.3733148349125154e-17);
			flyTo(targetPosition, controlsPosition);
		},

		toUluru: () => {
			const targetPosition = new Vector3(4566.196382565265, -2918.2956143138167, 1.0185954608768784);
			const controlsPosition = new Vector3(4567.893912842968, -2918.3165288349187, 6.544176126806917e-18);
			flyTo(targetPosition, controlsPosition);
		},

		toFuji: () => {
			const targetPosition = new Vector3(5422.954338850587, 4203.371844605109, 3.4382452420123366);
			const controlsPosition = new Vector3(5424.711265795956, 4211.637536011978, -3.121323278595189e-18);
			flyTo(targetPosition, controlsPosition);
		},
		toNewyork: () => {
			const targetPosition = new Vector3(-18256.922303267456, 4967.659263902319, 1.6554257243621036);
			const controlsPosition = new Vector3(-18256.866473664508, 4969.044670725848, 6.725020259932867e-16);
			flyTo(targetPosition, controlsPosition);
		},
		toHome: () => {
			const targetPosition = new Vector3(2108.604364020607, 4063.4424268618322, 0.7844306648429059);
			const controlsPosition = new Vector3(2108.6251495800407, 4064.1558637058156, 0);
			flyTo(targetPosition, controlsPosition);
		},

		toSchool: () => {
			const targetPosition = new Vector3(4082.8048722195954, 5741.659532031964, 0.5669018675969298);
			const controlsPosition = new Vector3(4082.881226619693, 5741.233895683455, -8.233075338228967e-17);
			flyTo(targetPosition, controlsPosition);
		},

		showCameraInfo: () => {
			const cameraPos = viewer.camera.position;
			const targetPos = viewer.controls.target;
			const code = `
() => {
    const targetPosition = new Vector3(${cameraPos.x},${cameraPos.y},${cameraPos.z});
    const controlsPosition = new Vector3(${targetPos.x},${targetPos.y},${targetPos.z});
    flyTo(targetPosition,controlsPosition);
}
`;
			navigator.clipboard.writeText(code);
			console.log("-----------------------------------------------------------------------------------------");
			console.log(code);
			console.log("-----------------------------------------------------------------------------------------");
			console.log("Code has copide to clipboard");
		},

		cameraHelper: () => {
			helper.camera.copy(viewer.camera);
		},
	};

	const folder = gui.addFolder("Camera position");

	folder.add(vm, "restCamera").name("Reset");
	folder.add(vm, "showCameraInfo");
	folder.add(vm, "toHome");
	folder.add(vm, "toSchool");
	folder.add(vm, "toBeiJing");
	folder.add(vm, "toYanan");
	folder.add(vm, "toQomolangma");
	folder.add(vm, "toTaiBai");
	folder.add(vm, "toHuaShan");
	folder.add(vm, "toHuangShan");
	folder.add(vm, "toTaiShan");
	folder.add(vm, "toFuji");
	folder.add(vm, "toUluru");
	folder.add(vm, "toNewyork");
	folder.add(vm, "cameraHelper");
	// folder.add(helper.children[0].position, "Z", 0, 1e6);
};
