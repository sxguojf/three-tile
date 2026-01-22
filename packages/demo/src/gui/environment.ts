import { Color, CubeTextureLoader } from "three";
import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export const createEnvironmentGui = (gui: GUI, viewer: plugin.GLViewer, map: tt.TileMap) => {
	const vm = {
		skyColor: new Color(0x111111),
		skyVisible: true,
		skybox: new CubeTextureLoader()
			.setPath("./image/skybox/")
			.load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]),
		shadow: false,
		hue: 0,
		saturate: 1,
		brightness: 1,
		contrast: 1,
	};

	viewer.scene.background = vm.skyColor;

	viewer.addEventListener("update", () => {
		const dist = viewer.controls.getDistance();
		viewer.scene.background = dist > 5e5 ? vm.skyColor : vm.skybox;
	});

	const folder = gui.addFolder("场景环境").close();
	folder.add(viewer.ambLight, "intensity", 0, 5, 0.1).name("环境光");
	folder.add(viewer.dirLight, "intensity", 0, 5, 0.1).name("直射光");

	folder
		.add(viewer.renderer, "toneMapping", {
			NoToneMapping: 0,
			LinearToneMapping: 1,
			ReinhardToneMapping: 2,
			CineonToneMapping: 3,
			ACESFilmicToneMapping: 4,
			CustomToneMapping: 5,
			AgXToneMapping: 6,
			NeutralToneMapping: 7,
		})
		.name("HDR效果");
	folder.add(viewer.renderer, "toneMappingExposure", 0, 5).name("HDR系数");

	folder.add(viewer, "fogFactor", 0, 10, 0.001).listen().name("雾浓度");

	const fakeEarth = viewer.scene.getObjectByName("fakeearth") as plugin.FakeEarth | null;
	if (fakeEarth) {
		folder.add<plugin.FakeEarth, "isMesh">(fakeEarth, "isMesh").name("地球遮罩");
	}

	folder
		.add(vm, "shadow")
		.onChange(value => {
			viewer.renderer.shadowMap.enabled = value;
			viewer.dirLight.castShadow = value;
			viewer.scene.castShadow = value;
			viewer.scene.receiveShadow = value;
			map.receiveShadow = value;
		})
		.listen()
		.name("开启/关闭阴影");

	let filterStyle = "";
	const updateFilterStyle = () => {
		filterStyle = `hue-rotate(${vm.hue}deg) saturate(${vm.saturate}) brightness(${vm.brightness}) contrast(${vm.contrast})`;
		if (viewer.container) {
			viewer.container.style.filter = filterStyle;
		}
	};

	folder.add(vm, "hue", 0, 360).onChange(updateFilterStyle).name("色调");
	folder.add(vm, "saturate", 0, 5).onChange(updateFilterStyle).name("饱和度");
	folder.add(vm, "brightness", 0, 5, 0.1).onChange(updateFilterStyle).name("亮度");
	folder.add(vm, "contrast", 0, 5, 0.1).onChange(updateFilterStyle).name("对比度");

	return gui;
};
