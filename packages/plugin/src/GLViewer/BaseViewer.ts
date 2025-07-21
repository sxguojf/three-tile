/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import {
	AmbientLight,
	BaseEvent,
	Camera,
	Clock,
	Color,
	DepthTexture,
	DirectionalLight,
	EventDispatcher,
	FloatType,
	FogExp2,
	Mesh,
	PerspectiveCamera,
	PlaneGeometry,
	RedFormat,
	RGBAFormat,
	Scene,
	ShaderMaterial,
	WebGLRenderer,
	WebGLRenderTarget,
} from "three";

import { update as teweenUpdate } from "three/examples/jsm/libs/tween.module.js";

/**
 * Viewer event map
 */

export interface ViewerEventMap extends BaseEvent {
	update: BaseEvent & { delta: number };
	resize: { size: { width: number; height: number } };
}

/**
 * Viewer options
 */
export type ViewerOptions = {
	/** Whether to use antialiasing. Default is false. */
	antialias?: boolean;
	/** Whether to use stencil buffer. Default is true. */
	stencil?: boolean;
	/** Whether to use logarithmic depth buffer. Default is true. */
	logarithmicDepthBuffer?: boolean;
};

/**
 * Threejs scene initialize base class
 */
export class BaseViewer extends EventDispatcher<ViewerEventMap> {
	public readonly scene: Scene;
	public readonly topScenes: Scene[] = [];

	public readonly renderer: WebGLRenderer;

	public readonly depthRenderTarget?: WebGLRenderTarget;

	public readonly camera: PerspectiveCamera;

	public readonly ambLight: AmbientLight;
	public readonly dirLight: DirectionalLight;

	public readonly clock: Clock = new Clock();
	public container?: HTMLElement;

	/** Container width */
	public get width() {
		return this.container?.clientWidth || 0;
	}

	/** Container height */
	public get height() {
		return this.container?.clientHeight || 0;
	}

	/**
	 * Constructor
	 * @param container container element or selector string
	 * @param options GLViewer options
	 */
	constructor(container?: HTMLElement | string, options: ViewerOptions = {}) {
		super();

		const { antialias = false, stencil = true, logarithmicDepthBuffer = true } = options;
		this.renderer = this.createRenderer(antialias, stencil, logarithmicDepthBuffer);
		this.scene = this.createScene();
		this.camera = this.createCamera();
		if (container) {
			this.addTo(container);
		}
		this.depthRenderTarget = this.createDepthRenderTarget();
		this.ambLight = this.createAmbLight();
		this.dirLight = this.createDirLight();
		this.scene.add(this.ambLight);
		this.scene.add(this.dirLight);
		this.renderer.setAnimationLoop(this.animate.bind(this));
	}

	/**
	 * Add the renderer to a container
	 * @param container container element or selector string
	 * @returns this
	 */
	public addTo(container: HTMLElement | string) {
		const el = typeof container === "string" ? document.querySelector(container) : container;
		if (el instanceof HTMLElement) {
			this.container = el;
			el.appendChild(this.renderer.domElement);
			new ResizeObserver(this.resize.bind(this)).observe(el);
		} else {
			throw `${container} not found!}`;
		}
		return this;
	}

	/**
	 * Create scene
	 * @returns scene
	 */
	protected createScene() {
		const scene = new Scene();
		const backColor = 0xdbf0ff;
		scene.background = new Color(backColor);
		scene.fog = new FogExp2(backColor, 0);
		return scene;
	}

	/**
	 * Create WebGL renderer
	 * @param antialias
	 * @param stencil
	 * @param logarithmicDepthBuffer
	 * @returns renderer
	 */
	protected createRenderer(antialias: boolean, stencil: boolean, logarithmicDepthBuffer: boolean) {
		const renderer = new WebGLRenderer({
			antialias,
			logarithmicDepthBuffer,
			stencil,
			alpha: true,
			precision: "highp",
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.domElement.tabIndex = 0;
		renderer.domElement.style.outline = "none";
		return renderer;
	}

	protected createDepthRenderTarget() {
		const depthRenderTarget = new WebGLRenderTarget(this.width, this.height, {
			depthBuffer: true,
			depthTexture: new DepthTexture(this.width, this.height),
		});
		return depthRenderTarget;
	}

	/**
	 * Create camera
	 * @returns camera
	 */
	protected createCamera() {
		const camera = new PerspectiveCamera(70, 1, 100, 5e7);
		camera.position.set(0, 2.8e7, 0);
		return camera;
	}

	/**
	 * Create ambient light
	 * @returns AmbientLight
	 */
	protected createAmbLight() {
		const ambLight = new AmbientLight(0xffffff, 1);
		return ambLight;
	}

	/**
	 * Create directional light
	 * @returns DirectionalLight
	 */
	protected createDirLight() {
		const dirLight = new DirectionalLight(0xffffff, 1);
		dirLight.position.set(0, 2e3, 1e3);
		dirLight.target.position.set(0, 0, 0);
		return dirLight;
	}

	/**
	 * Container resize
	 * @returns this
	 */
	public resize() {
		const width = this.width;
		const height = this.height;
		this.renderer.setSize(width, height);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.depthRenderTarget?.setSize(this.width, this.height);

		// 防止resize过程中黑屏
		this.update();
		this.dispatchEvent({ type: "resize", size: { width, height } });
		return this;
	}

	protected update() {
		this.renderer.autoClear = false;
		this.renderer.render(this.scene, this.camera);
		// this.topScenes.forEach(scene => {
		// 	this.renderer.clearDepth();
		// 	this.renderer.render(scene, this.camera);
		// });
		// this.renderer.autoClear = true;
	}

	public getDethBuffer() {
		// if (this.depthRenderTarget) {
		// 	this.renderer.setRenderTarget(this.depthRenderTarget);
		// 	this.renderer.render(this.scene, this.camera);

		// 	const depthBuffer = new Uint16Array(this.width * this.height); // 16位深度
		// 	this.renderer.readRenderTargetPixels(this.depthRenderTarget, 0, 0, this.width, this.height, depthBuffer);
		// 	this.renderer.setRenderTarget(null);
		// 	return depthBuffer;
		// } else {
		// 	return null;
		// }
		// const target = new WebGLRenderTarget(this.width, this.height, { depthBuffer: true });
		// this.renderer.setRenderTarget(target);
		// this.renderer.render(this.scene, this.camera);
		// const depthBuffer = new Uint16Array(this.width * this.height);
		// this.renderer.readRenderTargetPixels(target, 0, 0, this.width, this.height, depthBuffer);
		// this.renderer.setRenderTarget(null);
		// return depthBuffer;
		if (this.depthRenderTarget) {
			return readDepthBuffer(this.renderer, this.depthRenderTarget, this.camera);
		} else {
			return null;
		}
		// return getDepthBufferDirectly(this.renderer, this.camera, this.scene);
	}

	/**
	 * Threejs animation loop
	 */
	public animate() {
		this.update();
		this.dispatchEvent({ type: "update", delta: this.clock.getDelta() });
		teweenUpdate();
	}
}
async function readDepthBuffer(
	renderer: WebGLRenderer,
	renderTarget: WebGLRenderTarget,
	camera: PerspectiveCamera,
	width = renderTarget.width,
	height = renderTarget.height
) {
	// 1. 检查 renderTarget 是否有深度纹理
	if (!renderTarget.depthTexture) {
		throw new Error("renderTarget must have a depthTexture attached.");
	}

	// 2. 创建一个临时 RenderTarget，用于将深度值渲染到颜色纹理
	const tempRenderTarget = new WebGLRenderTarget(width, height, {
		type: FloatType, // 使用浮点纹理存储深度
		format: RGBAFormat, // 仅存储 R 通道（节省内存）
	});

	// 3. 创建 ShaderMaterial，将深度纹理复制到颜色纹理
	const depthCopyMaterial = new ShaderMaterial({
		uniforms: {
			depthTexture: { value: renderTarget.depthTexture },
			cameraNear: { value: camera.near },
			cameraFar: { value: camera.far },
		},
		vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
		fragmentShader: `
      uniform sampler2D depthTexture;
      uniform float cameraNear;
      uniform float cameraFar;
      varying vec2 vUv;
 
      // 从深度纹理读取非线性深度值 [0, 1]
      float readDepth(sampler2D depthSampler, vec2 coord) {
        float fragCoordZ = texture2D(depthSampler, coord).r;
        // 可选：转换为线性深度（如果需要）
        float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
        return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
      }
 
      // 透视投影深度转视图空间 Z
      float perspectiveDepthToViewZ(float depth, float near, float far) {
        float z = depth * 2.0 - 1.0; // [0,1] -> [-1,1]
        return (2.0 * near * far) / (far + near - z * (far - near));
      }
 
      // 视图空间 Z 转线性深度 [0,1]
      float viewZToOrthographicDepth(float z, float near, float far) {
        return (z - near) / (far - near);
      }
 
      void main() {
        float depth = readDepth(depthTexture, vUv);
        gl_FragColor = vec4(depth, 0.0, 0.0, 1.0); // 存储在 R 通道
      }
    `,
	});

	// 4. 创建临时场景和四边形，用于后处理
	const depthScene = new Scene();
	const quad = new Mesh(new PlaneGeometry(2, 2), depthCopyMaterial);
	depthScene.add(quad);

	// 5. 渲染深度到临时 RenderTarget
	renderer.setRenderTarget(tempRenderTarget);
	renderer.render(depthScene, camera);
	renderer.setRenderTarget(null);

	// 6. 读取像素数据（使用 Promise 确保异步完成）
	const pixelBuffer = new Float32Array(width * height * 4); // RGBA
	renderer.readRenderTargetPixelsAsync(tempRenderTarget, 0, 0, width, height, pixelBuffer);

	// 7. 提取 R 通道的深度值（按行优先存储）
	const depthArray = new Float32Array(width * height);
	for (let i = 0; i < width * height; i++) {
		depthArray[i] = pixelBuffer[i * 4]; // R 通道
	}

	// 8. 清理临时资源
	tempRenderTarget.dispose();
	depthCopyMaterial.dispose();

	return depthArray;
}
