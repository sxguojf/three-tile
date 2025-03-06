import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import * as tt from "../../src";
import { Color, CubeTextureLoader } from "three";

export const createEnvironmentGui = (gui: GUI, viewer: tt.plugin.GLViewer) => {
	const vm = {
		skyColor: new Color(0xdbf0ff),
		skyVisible: true,
		skybox: new CubeTextureLoader()
			.setPath("./image/skybox/")
			.load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]),
	};

	viewer.scene.background = vm.skybox;

	const folder = gui.addFolder("Environent").close();
	folder.add(viewer.ambLight, "intensity", 0, 5, 0.1).name("Ambient intensity");
	folder.add(viewer.dirLight, "intensity", 0, 5, 0.1).name("Directional intensity");
	folder.add(viewer.camera, "fov", 30, 120).onChange(() => viewer.camera.updateProjectionMatrix());

	folder.add(viewer.renderer, "toneMapping", {
		NoToneMapping: 0,
		LinearToneMapping: 1,
		ReinhardToneMapping: 2,
		CineonToneMapping: 3,
		ACESFilmicToneMapping: 4,
		CustomToneMapping: 5,
		AgXToneMapping: 6,
		NeutralToneMapping: 7,
	});
	folder.add(viewer.renderer, "toneMappingExposure", 0, 5);

	folder
		.add(vm, "skyVisible")
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

	folder.add(viewer.scene.fog as any, "factor", 0, 10, 0.001).listen();

	const background = viewer.scene.getObjectByName("background");
	if (background) {
		folder.add(background, "visible").name("Background");
	}

	const fakeEarth = viewer.scene.getObjectByName("fakeearth") as tt.plugin.FakeEarth;
	if (fakeEarth) {
		folder.add<tt.plugin.FakeEarth, "isMesh">(fakeEarth, "isMesh").name("Global mask");
	}

	folder.add(viewer.renderer.shadowMap, "enabled").name("Shadows");

	return gui;
};
