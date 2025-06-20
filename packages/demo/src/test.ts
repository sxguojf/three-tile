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
	AdditiveBlending,
	AnimationMixer,
	BoxHelper,
	CameraHelper,
	CanvasTexture,
	Color,
	ConeGeometry,
	FrontSide,
	Mesh,
	MeshBasicMaterial,
	MeshLambertMaterial,
	Scene,
	ShaderMaterial,
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

		const scene = viewer.scene;
		// const scene = topScene;

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

export function testShader() {
	const loader = tt.getImgLoader<tt.TileMaterialLoader>("image");
	loader.onCreateMaterial = () => {
		const singleColorMaterial = new MeshBasicMaterial({
			map: null, // 原始纹理（可选）
			color: new Color(0xaaffff), // 目标单色（红色示例）
			fog: true,
		});

		singleColorMaterial.onBeforeCompile = shader => {
			// console.log(shader.fragmentShader);

			// 修改片段着色器
			shader.fragmentShader = shader.fragmentShader.replace(
				"#include <dithering_fragment>",
				`			
			    vec4 texel = texture2D( map, vMapUv );
      
				// 1. 反色处理
				vec3 inverted = mix(texel.rgb, 1.0 - texel.rgb, 0.9);
				
				// 2. 转换为灰度
				float luminance = dot(inverted, vec3(0.299, 0.587, 0.114));
				vec3 grayscale = vec3(luminance);
				
				// 3. 应用目标颜色
				vec3 finalColor = mix(grayscale, inverted, 0.5) * diffuse;
				
				gl_FragColor =  vec4( finalColor, opacity * texel.a );
				
			`
			);
			// console.log(shader.fragmentShader);
		};
		return singleColorMaterial;
	};
}

export function testDEMShader() {
	const loader = tt.getImgLoader<tt.TileMaterialLoader>("image");
	loader.onCreateMaterial = () => {
		const demMaterial = createTerrainHeightMaterial(0, 3500);
		return demMaterial;
	};
}

// 创建地形高度着色器材质
function createTerrainHeightMaterial(minHeight: number, maxHeight: number) {
	// 顶点着色器
	const vertexShader = `
        varying float vHeight;
        varying vec3 vPosition;
        

        void main() {
            vHeight = position.z;
            vPosition = position;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

	// 片段着色器
	const fragmentShader = `
        varying float vHeight;
        varying vec3 vPosition;

        uniform float uMinHeight;
        uniform float uMaxHeight;
        uniform vec3 uWaterColor;
        uniform vec3 uSandColor;
        uniform vec3 uGrassColor;
        uniform vec3 uRockColor;
        uniform vec3 uSnowColor;
        
        // 平滑过渡函数
        float smoothBlend(float edge0, float edge1, float x) {
            float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
            return t * t * (3.0 - 2.0 * t);
        }

        void main() {
            // 归一化高度 (0到1之间)
            float normalizedHeight = (vHeight - uMinHeight) / (uMaxHeight - uMinHeight);
            
            // 定义各高度段的阈值
            float waterLevel = 0.2;
            float sandLevel = 0.3;
            float grassLevel = 0.6;
            float rockLevel = 0.85;
            
            // 根据高度混合颜色
            vec3 color;
            
            if(normalizedHeight < waterLevel) {
                // 水区域 - 深蓝色到浅蓝色
                float t = smoothBlend(0.0, waterLevel, normalizedHeight);
                color = mix(uWaterColor * 0.5, uWaterColor, t);
            } 
            else if(normalizedHeight < sandLevel) {
                // 沙滩区域 - 浅蓝色到沙色
                float t = smoothBlend(waterLevel, sandLevel, normalizedHeight);
                color = mix(uWaterColor, uSandColor, t);
            } 
            else if(normalizedHeight < grassLevel) {
                // 草地区域 - 沙色到绿色
                float t = smoothBlend(sandLevel, grassLevel, normalizedHeight);
                color = mix(uSandColor, uGrassColor, t);
            } 
            else if(normalizedHeight < rockLevel) {
                // 岩石区域 - 绿色到棕色
                float t = smoothBlend(grassLevel, rockLevel, normalizedHeight);
                color = mix(uGrassColor, uRockColor, t);
            } 
            else {
                // 雪地区域 - 棕色到白色
                float t = smoothBlend(rockLevel, 1.0, normalizedHeight);
                color = mix(uRockColor, uSnowColor, t);
            }
            
            // 添加简单光照效果（基于法线）
            // vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
            // float diffuse = dot(normalize(vPosition), lightDir) * 0.5 + 0.5;
            // color *= diffuse;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

	// 创建着色器材质
	const material = new ShaderMaterial({
		uniforms: {
			uMinHeight: { value: minHeight },
			uMaxHeight: { value: maxHeight },
			uWaterColor: { value: new Color(0.1, 0.3, 0.7) },
			uSandColor: { value: new Color(0.76, 0.7, 0.5) },
			uGrassColor: { value: new Color(0.3, 0.6, 0.2) },
			uRockColor: { value: new Color(0.5, 0.4, 0.3) },
			uSnowColor: { value: new Color(0.95, 0.95, 1.0) },
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: FrontSide,
		wireframe: false,
		transparent: true,
		blending: AdditiveBlending,
	});

	return material;
}
