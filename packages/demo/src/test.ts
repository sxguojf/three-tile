// 测试
// const imageBounds = map.projection.getProjBounds([105, 33, 109, 37]);
// const imageMesh = createBoundsMesh(imageBounds, 0xffff00);
// map.add(imageMesh);
// const tileBounds = map.projection.getTileBounds(7, 2, 3);
// const tileMesh = createBoundsMesh(tileBounds, 0xff0000);
// map.add(tileMesh);

// const mapBounds = map.imgSource[0]._projectionBounds;
// const mapMesh = createBoundsMesh(mapBounds, 0x00ff00);
// map.add(mapMesh);

// function createBoundsMesh(bounds: [number, number, number, number], color: ColorRepresentation) {
// 	const points = [];
// 	const z = 8;
// 	points.push(new Vector3(bounds[0], bounds[1], z));
// 	points.push(new Vector3(bounds[2], bounds[1], z));
// 	points.push(new Vector3(bounds[2], bounds[3], z));
// 	points.push(new Vector3(bounds[0], bounds[3], z));
// 	points.push(new Vector3(bounds[0], bounds[1], z));
// 	const geometry = new BufferGeometry().setFromPoints(points);
// 	const line = new Line(geometry, new LineBasicMaterial({ color }));
// 	line.renderOrder = 100;
// 	return line;
// }

import { AnimationMixer, Box3, CameraHelper, Group, Scene, SpotLight, SpotLightHelper, Vector3 } from "three";
import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

// shadowTest(viewer, map);

export function test(viewer: plugin.GLViewer, map: tt.TileMap) {
	// 增加顶层场景，用于显示模型
	const topScene = new Scene();

	viewer.topScenes.push(topScene);

	const centerGeo = new Vector3(110, 35, 0);
	const centerPosition = map.geo2world(centerGeo);

	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath("./lib/draco/gltf/");
	const loader = new GLTFLoader();
	loader.setDRACOLoader(dracoLoader);
	let model: Group;

	// 加载模型
	loader.load("./model/LittlestTokyo.glb", function (gltf) {
		model = gltf.scene;
		model.traverse(child => {
			child.castShadow = true;
			child.receiveShadow = true;
		});
		// 计算模型位置
		const bbox = new Box3().setFromObject(model);
		model.position.set(centerPosition.x, 500 - bbox.min.y, centerPosition.z);
		// 模型动画
		const mixer = new AnimationMixer(model);
		mixer.clipAction(gltf.animations[0]).play();
		map.addEventListener("update", evt => mixer.update(evt.delta));

		// const scene = viewer.scene;
		const scene = topScene;

		scene.receiveShadow = true;
		scene.castShadow = true;
		// 添加模型
		scene.add(model);
		// 添加环境光
		scene.add(viewer.ambLight.clone());
		// 添加直射光
		scene.add(viewer.dirLight.clone());

		// 添加一个聚光灯
		const shadowLight = new SpotLight(0xffffff, 3, 4e3, Math.PI / 6, 0.2, 0);
		shadowLight.position.set(centerPosition.x, 2e3, centerPosition.z + 1000);
		shadowLight.target = model;
		shadowLight.castShadow = true;
		shadowLight.shadow.camera.near = 1e3;
		shadowLight.shadow.camera.far = 6e3;
		scene.add(shadowLight);

		// 添加一个聚光灯相机辅助模型
		const cameraHelper = new CameraHelper(shadowLight.shadow.camera);
		scene.add(cameraHelper);

		// // 添加一个聚光灯辅助模型
		const lightHelper = new SpotLightHelper(shadowLight);
		scene.add(lightHelper);
	});
}
