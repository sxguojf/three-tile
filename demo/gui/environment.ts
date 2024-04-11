import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import * as tt from "../../src";
import { Color, CubeTextureLoader } from "three";

export const createEnvironmentGui = (gui: GUI, viewer: tt.plugin.GLViewer) => {
	const vm = {
		skyColor: new Color(0xdbf0ff),
		skyVisible: true,
		skybox: new CubeTextureLoader()
			.setPath("../assets/image/skybox/")
			.load([
				"skybox_nx.png",
				"skybox_px.png",
				"skybox_ny.png",
				"skybox_py.png",
				"skybox_nz.png",
				"skybox_pz.png",
			]),
	};

	viewer.scene.background = vm.skybox;

	const folder = gui.addFolder("环境设置").close();
	folder.add(viewer.ambLight, "intensity", 0, 1, 0.1).name("环境光强度");
	folder.add(viewer.dirLight, "intensity", 0, 1, 0.1).name("直射光强度");

	// THREE.NoToneMapping
	// THREE.LinearToneMapping
	// THREE.ReinhardToneMapping
	// THREE.CineonToneMapping
	// THREE.ACESFilmicToneMapping
	folder
		.add(viewer.renderer, "toneMapping", {
			NoToneMapping: 0,
			LinearToneMapping: 1,
			ReinhardToneMapping: 2,
			CineonToneMapping: 3,
			ACESFilmicToneMapping: 4,
		})
		.name("HDR");
	folder.add(viewer.renderer, "toneMappingExposure", 0, 2).name("HDR曝光系数");

	folder
		.add(vm, "skyVisible")
		.name("白云")
		.onChange((value: boolean) => {
			if (value) {
				viewer.scene.background = vm.skybox;
				viewer.scene.fog!.color.set(0xdbf0ff);
			} else {
				viewer.scene.background = vm.skyColor;
				viewer.scene.fog!.color.set(vm.skyColor);
			}
		})
		.listen();

	folder
		.addColor(vm, "skyColor")
		.name("天空及雾颜色")
		.listen()
		.onChange((value: Color) => {
			viewer.scene.background = value;
			viewer.scene.fog!.color.set(value);
			const fakeEarth = viewer.scene.getObjectByName("fakeearth");
			if (fakeEarth instanceof tt.plugin.FakeEarth) {
				fakeEarth.bkColor.set(value);
			}
			vm.skyVisible = false;
		});

	const bk = viewer.scene.getObjectByName("background");
	if (bk) {
		folder.add(viewer, "fogFactor", 0, 10, 0.001).listen().name("能见度系数");
		folder.add(bk, "visible").name("地图背景图");
	}

	const fakeEarth = viewer.scene.getObjectByName("fakeearth");
	if (fakeEarth) {
		folder.add(fakeEarth, "isMesh").name("地球遮罩");
	}

	return gui;
};
