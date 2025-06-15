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

import {
	AnimationMixer,
	BoxHelper,
	CameraHelper,
	CanvasTexture,
	ConeGeometry,
	Material,
	Mesh,
	MeshLambertMaterial,
	Plane,
	Scene,
	SpotLight,
	SpotLightHelper,
	Sprite,
	SpriteMaterial,
	TextureLoader,
	Vector3,
} from "three";
import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

// shadowTest(viewer, map);

export function testTopMesh(viewer: plugin.GLViewer, map: tt.TileMap) {
	// 增加顶层场景，用于显示模型
	const topScene = new Scene();
	viewer.topScenes.push(topScene);

	const groundGroup = new plugin.GroundGroup(map);

	const centerGeo = new Vector3(110, 35, 0);
	const centerPosition = map.geo2world(centerGeo);

	// viewer.flyTo(centerPosition, new Vector3(centerPosition.x, 1000, centerPosition.z + 2000), true);

	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath("./lib/draco/gltf/");
	const loader = new GLTFLoader();
	loader.setDRACOLoader(dracoLoader);

	// 加载模型
	loader.load("./model/LittlestTokyo.glb", function (gltf) {
		const model = gltf.scene;
		model.traverse(child => {
			child.castShadow = true;
			child.receiveShadow = true;
		});
		// 计算模型位置
		model.position.copy(centerPosition);
		groundGroup.add(model);
		// 模型动画
		const mixer = new AnimationMixer(model);
		mixer.clipAction(gltf.animations[0]).play();
		map.addEventListener("update", evt => mixer.update(evt.delta));

		// const scene = viewer.scene;
		const scene = topScene;

		scene.receiveShadow = true;
		scene.castShadow = true;
		// 添加模型
		// scene.add(model);
		scene.add(groundGroup);
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

		// viewer.flyToObject(model, { animate: false });
		// viewer.flyTo(centerPosition, new Vector3(centerPosition.x, 2000, centerPosition.z), true);

		viewer.flyToObject(model, { pitchDeg: 50 });
	});
}

export function testTileHelperBox(map: tt.TileMap) {
	map.addEventListener("tile-loaded", evt => {
		const mesh = evt.tile.model;
		if (mesh) {
			mesh.add(new BoxHelper(mesh, 0x00ff00));
			// console.log(map.projection.getLonLatBoundsFromXYZ(evt.tile.x, evt.tile.y, evt.tile.z));
		}
	});
	map.addEventListener("tile-unload", evt => {
		const mesh = evt.tile.model;
		if (mesh) {
			mesh.traverse(child => {
				if (child instanceof BoxHelper) {
					child.dispose();
				}
			});
			mesh.clear();
		}
	});
}

export function goHome(viewer: plugin.GLViewer, map: tt.TileMap) {
	// 按下 F1 键事件
	window.addEventListener("keydown", event => {
		if (event.key === "F1") {
			event.preventDefault();
			if (!map.getObjectByName("boards")) {
				// open("https://github.com/sxguojf/three-tile");
				const boards = createBillboards("three-tile");
				boards.name = "boards";
				map.add(boards);

				map.addEventListener("loading-complete", () => {
					const info = map.getLocalInfoFromGeo(lonlat);
					if (info) {
						// boards.visible = (info.object as Tile).z > 10;
						boards.visible = true;
						const pos = map.geo2map(info.location);
						boards.position.copy(pos);
					}
				});
			}
			const lonlat = new Vector3(108.94236, 34.2855, 0);
			const centerPosition = map.geo2world(lonlat);
			const cameraPosition = centerPosition.clone().add(new Vector3(-1000, 2000, 0));
			viewer.flyTo(centerPosition, cameraPosition);
		}
	});
}

function drawBillboards(txt: string, size: number = 128) {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Failed to get canvas context");
	}

	canvas.width = size;
	canvas.height = size;
	const centerX = size / 2;
	const centerY = size / 2;

	ctx.imageSmoothingEnabled = false;
	ctx.fillStyle = "#000022";
	ctx.strokeStyle = "DarkGoldenrod";

	ctx.lineWidth = 5;
	ctx.moveTo(centerX, 3);
	ctx.lineTo(centerX, size);
	ctx.stroke();
	ctx.closePath();

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.roundRect(2, 2, size - 4, centerY - 8, 10);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

	ctx.font = "24px Arial";
	ctx.fillStyle = "Goldenrod";
	ctx.strokeStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	ctx.strokeText(txt, centerX, 20);
	ctx.fillText(txt, centerX, 20);

	return canvas;
}

/**
 * 创建一个带有指定文本的广告牌精灵对象。
 *
 * @param txt - 要显示在广告牌上的文本内容。
 * @param size - 广告牌纹理的尺寸，默认为 128。
 * @returns 返回一个 Three.js 的 Sprite 对象，代表创建好的广告牌。
 */
export function createBillboards(txt: string, size = 128) {
	// 调用 drawBillboards 函数生成包含指定文本的画布，然后使用该画布创建纹理
	const boardTexture = new CanvasTexture(drawBillboards(txt, size));
	// 使用创建好的纹理创建精灵材质，设置尺寸不随相机距离衰减
	const boardsMaterial = new SpriteMaterial({
		map: boardTexture,
		sizeAttenuation: false,
	});
	// 使用精灵材质创建一个精灵对象，即广告牌
	const boards = new Sprite(boardsMaterial);
	// 默认将广告牌设置为不可见
	boards.visible = false;
	// 设置广告牌的中心点位置，x 轴居中，y 轴偏移 0.3
	boards.center.set(0.5, 0.3);
	// 缩放广告牌的尺寸
	boards.scale.setScalar(0.1);
	boards.renderOrder = 999;
	return boards;
}

export function addIcon(map: tt.TileMap, lonlat: Vector3) {
	const icon = new Sprite(
		new SpriteMaterial({ map: new TextureLoader().load("./image/gis.png"), sizeAttenuation: false, transparent: true })
	);
	icon.renderOrder = 999;
	icon.center.set(0.5, 0);
	icon.scale.setScalar(0.05);
	const position = map.geo2map(lonlat);
	icon.position.copy(position);
	map.add(icon);
}

export function testHole(viewer: plugin.GLViewer, map: tt.TileMap) {
	viewer.renderer.localClippingEnabled = true;

	// Dig a hole on basemap
	const bounds = [108.6880874, 33.921995, 108.882408, 34.057271];
	const sw = map.geo2world(new Vector3(bounds[0], bounds[1]));
	const ne = map.geo2world(new Vector3(bounds[2], bounds[3]));

	// const mesh = new Mesh(
	// 	new BoxGeometry(ne.x - sw.x - 1000, 0, ne.z - sw.z - 1000),
	// 	new MeshLambertMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 })
	// );
	// mesh.position.copy(sw);
	// mesh.position.x += (ne.x - sw.x) / 2;
	// mesh.position.z += (ne.z - sw.z) / 2;
	// mesh.position.y = 0;
	// viewer.scene.add(mesh);

	const clipPlanes = [
		new Plane(new Vector3(-1, 0, 0), sw.x),
		new Plane(new Vector3(1, 0, 0), -ne.x),
		new Plane(new Vector3(0, 0, 1), -sw.z),
		new Plane(new Vector3(0, 0, -1), ne.z),
	];
	map.addEventListener("tile-loaded", evt => {
		console.log(evt.tile.x, evt.tile.y, evt.tile.z);

		const materails = evt.tile.model?.material as Material[];

		materails?.forEach(m => {
			m.clipIntersection = true;
			m.clippingPlanes = clipPlanes;
		});
	});
}

export function createGroundGroup(map: tt.TileMap) {
	const groundGroup = new plugin.GroundGroup(map);
	groundGroup.name = "groundGroup";
	map.add(groundGroup);
	const ball = new Mesh(new ConeGeometry(1, 20, 32), new MeshLambertMaterial({ color: 0xff0000, wireframe: false }));
	ball.rotateX(-Math.PI / 2);
	for (let i = 0; i < 1000; i++) {
		const oneBall = ball.clone();
		const lon = Math.random() * 360 - 180;
		const lat = Math.random() * 180 - 90;
		oneBall.position.copy(map.geo2map(new Vector3(lon, lat, 0)));
		oneBall.scale.setScalar(10000);
		groundGroup.add(oneBall);
	}
}
