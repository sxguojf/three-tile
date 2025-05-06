import { Color, CubeTextureLoader } from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

export const createEnvironmentGui = (gui: GUI, viewer: plugin.GLViewer, map: tt.TileMap) => {
	const vm = {
		skyColor: new Color(0xdbf0ff),
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

	viewer.scene.background = vm.skybox;

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

	folder
		.add(vm, "skyVisible")
		.name("天空")
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
		.name("天空和雾颜色")
		.listen()
		.onChange((value: Color) => {
			viewer.scene.background = value;
			viewer.scene.fog!.color.set(value);
			const fakeEarth = viewer.scene.getObjectByName("fakeearth");
			if (fakeEarth instanceof plugin.FakeEarth) {
				fakeEarth.bkColor.set(value);
			}
			vm.skyVisible = false;
		});

	folder.add(viewer, "fogFactor", 0, 10, 0.001).listen().name("雾浓度");

	const fakeEarth = viewer.scene.getObjectByName("fakeearth") as plugin.FakeEarth;
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
			// map.castShadow = value;
			map.receiveShadow = value;
		})
		.listen()
		.name("开启/关闭阴影");

	const onFilterChange = () => {
		if (viewer.container) {
			viewer.container.style.filter = `hue-rotate(${vm.hue}deg) saturate(${vm.saturate}) brightness(${vm.brightness}) contrast(${vm.contrast})`;
		}
	};

	// hue: "hue-rotate(135deg)";
	folder.add(vm, "hue", 0, 360).onChange(onFilterChange).name("色调");
	folder.add(vm, "saturate", 0, 5).onChange(onFilterChange).name("饱和度");
	folder.add(vm, "brightness", 0, 5, 0.1).onChange(onFilterChange).name("亮度");
	folder.add(vm, "contrast", 0, 5, 0.1).onChange(onFilterChange).name("对比度");

	return gui;
};
