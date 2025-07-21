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
	MeshBasicMaterial,
	MeshDepthMaterial,
	NearestFilter,
	OrthographicCamera,
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
			// depthTexture: new DepthTexture(this.width, this.height),
			type: FloatType,
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
		this.topScenes.forEach(scene => {
			this.renderer.clearDepth();
			this.renderer.render(scene, this.camera);
		});
		this.renderer.autoClear = true;

		if (this.depthRenderTarget) {
			this.renderer.setRenderTarget(this.depthRenderTarget);
			this.renderer.render(this.scene, this.camera);
			this.renderer.setRenderTarget(null);
		}
	}

	public getDethBuffer() {
		if (this.depthRenderTarget) {
			const buffer = new Float32Array(this.depthRenderTarget.width * this.depthRenderTarget.height);
			// 深度像素信息写入数组
			this.renderer.readRenderTargetPixels(
				this.depthRenderTarget,
				0,
				0,
				this.depthRenderTarget.width,
				this.depthRenderTarget.height,
				buffer
			);
			return buffer;
		} else {
			return null;
		}
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
