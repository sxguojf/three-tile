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

	const folder = gui.addFolder("Environeent").close();
	folder.add(viewer.ambLight, "intensity", 0, 1, 0.1).name("Ambient intensity");
	folder.add(viewer.dirLight, "intensity", 0, 1, 0.1).name("Directional intensity");

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
	folder.add(viewer.renderer, "toneMappingExposure", 0, 2);

	folder
		.add(vm, "skyVisible")
		.name("sky")
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
		.name("Sky and fog color")
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
		folder.add(viewer, "fogFactor", 0, 10, 0.001).listen();
		folder.add(bk, "visible").name("background image");
	}

	const fakeEarth = viewer.scene.getObjectByName("fakeearth");
	if (fakeEarth) {
		folder.add(fakeEarth, "isMesh").name("Global mask");
	}

	return gui;
};
