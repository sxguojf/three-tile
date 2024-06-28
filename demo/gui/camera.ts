import { Vector3 } from "three";
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
			.to({ y: 10000, z: 0 }, 500)
			// 再到目标位置
			.chain(new Tween(cameraPos).to(targetPosition))
			.start();
	};

	const vm = {
		restCamera: () => {
			const targetPosition = new Vector3(1113.1709969219833, 4000, 496.52541143740063);
			const controlsPosition = new Vector3(1113.1709969219833, 7.77927630882269e-13, -3503.4745885625994);
			flyTo(targetPosition, controlsPosition);
		},
		toBeiJing: () => {
			const targetPosition = new Vector3(2937.880446206417, 0.8982447706293892, -4852.837272434148);
			const controlsPosition = new Vector3(2937.8589434896376, -4.179171171745043e-21, -4853.535193447179);
			flyTo(targetPosition, controlsPosition);
		},
		toYanan: () => {
			const targetPosition = new Vector3(2169.9636368875927, 3.357202665730798, -4382.899361611179);
			const controlsPosition = new Vector3(2170.1276394330216, -3.919158283214042e-16, -4386.431762895977);
			flyTo(targetPosition, controlsPosition);
		},
		toQomolangma: () => {
			const targetPosition = new Vector3(-355.53948097364827, 8.632029116020062, -3243.3575887456013);
			const controlsPosition = new Vector3(-339.6053242829197, 3.5013277444405166e-15, -3245.922621415272);
			flyTo(targetPosition, controlsPosition);
		},
		toTaiBaiShan: () => {
			const targetPosition = new Vector3(1982.800201813011, 6.048197106233053, -4032.091565236495);
			const controlsPosition = new Vector3(1977.132544440199, 3.1481138177319502e-18, -4026.222479546381);
			flyTo(targetPosition, controlsPosition);
		},

		toHuaShan: () => {
			const targetPosition = new Vector3(2237.1526254014593, 5.7782429087784895, -4106.558071882356);
			const controlsPosition = new Vector3(2234.0706623994947, 8.924989421922145e-17, -4097.437786464135);
			flyTo(targetPosition, controlsPosition);
		},
		toHuangShan: () => {
			const targetPosition = new Vector3(3139.159996481894, 2.610548923663056, -3512.179963938414);
			const controlsPosition = new Vector3(3137.8203425198435, -4.050010631814304e-15, -3516.2442480350014);
			flyTo(targetPosition, controlsPosition);
		},
		toTaiShan: () => {
			const targetPosition = new Vector3(3017.0158184119055, 1.6517273521133014, -4327.635322127751);
			const controlsPosition = new Vector3(3016.924080838552, -2.3733148349125154e-17, -4330.879272502904);
			flyTo(targetPosition, controlsPosition);
		},

		toUluru: () => {
			const targetPosition = new Vector3(4566.196382565265, 1.0185954608768784, 2918.2956143138167);
			const controlsPosition = new Vector3(4567.893912842968, 6.544176126806917e-18, 2918.3165288349187);
			flyTo(targetPosition, controlsPosition);
		},

		toFuji: () => {
			const targetPosition = new Vector3(5422.954338850587, 3.4382452420123366, -4203.371844605109);
			const controlsPosition = new Vector3(5424.711265795956, -3.121323278595189e-18, -4211.637536011978);
			flyTo(targetPosition, controlsPosition);
		},
		toNewyork: () => {
			const targetPosition = new Vector3(-18256.922303267456, 1.6554257243621036, -4967.659263902319);
			const controlsPosition = new Vector3(-18256.866473664508, 6.725020259932867e-16, -4969.044670725848);
			flyTo(targetPosition, controlsPosition);
		},
		toHome: () => {
			const targetPosition = new Vector3(2108.604364020607, 0.7844306648429059, -4063.4424268618322);
			const controlsPosition = new Vector3(2108.6251495800407, 0, -4064.1558637058156);
			flyTo(targetPosition, controlsPosition);
		},
		toSchool: () => {
			const targetPosition = new Vector3(4082.8093451257946, 0.7902206445906863, -5741.944970088485);
			const controlsPosition = new Vector3(4082.9522902367175, -8.27047699764849e-17, -5741.148122418343);
			flyTo(targetPosition, controlsPosition);
		},
		CameraInfoToConsole: () => {
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
