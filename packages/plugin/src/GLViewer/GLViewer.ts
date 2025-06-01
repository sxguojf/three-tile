/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import {
	AmbientLight,
	BaseEvent,
	Clock,
	Color,
	DirectionalLight,
	EventDispatcher,
	FogExp2,
	MathUtils,
	Object3DEventMap,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
} from "three";

import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { Easing, Tween, update as teweenUpdate } from "three/examples/jsm/libs/tween.module.js";

/**
 * GlViewer event map
 */
export interface GLViewerEventMap extends Object3DEventMap {
	update: BaseEvent & { delta: number };
	resize: BaseEvent & { size: { width: number; height: number } };
}

/**
 * GlViewer options
 */
export type GLViewerOptions = {
	/** Whether to use antialiasing. Default is false. */
	antialias?: boolean;
	/** Whether to use stencil buffer. Default is true. */
	stencil?: boolean;
	/** Whether to use logarithmic depth buffer. Default is true. */
	logarithmicDepthBuffer?: boolean;
};

/**
 * Threejs scene initialize class
 */
export class GLViewer extends EventDispatcher<GLViewerEventMap> {
	public readonly scene: Scene;
	public readonly renderer: WebGLRenderer;

	public readonly camera: PerspectiveCamera;
	public readonly controls: MapControls;
	public readonly ambLight: AmbientLight;
	public readonly dirLight: DirectionalLight;
	public container?: HTMLElement;
	public topScenes: Scene[] = [];
	private readonly _clock: Clock = new Clock();

	private _fogFactor = 1.0;

	/** Get fog factor */
	public get fogFactor() {
		return this._fogFactor;
	}

	/** Set fog factor, default 1 */
	public set fogFactor(value) {
		this._fogFactor = value;
		this.controls.dispatchEvent({ type: "change" });
	}

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
	constructor(container?: HTMLElement | string, options: GLViewerOptions = {}) {
		super();

		const { antialias = false, stencil = true, logarithmicDepthBuffer = true } = options;
		this.renderer = this._createRenderer(antialias, stencil, logarithmicDepthBuffer);
		this.scene = this._createScene();
		this.camera = this._createCamera();
		if (container) {
			this.addTo(container);
		}
		this.controls = this._createControls();
		this.ambLight = this._createAmbLight();
		this.scene.add(this.ambLight);
		this.dirLight = this._createDirLight();
		this.scene.add(this.dirLight);
		this.scene.add(this.dirLight.target);

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
	private _createScene() {
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
	private _createRenderer(antialias: boolean, stencil: boolean, logarithmicDepthBuffer: boolean) {
		const renderer = new WebGLRenderer({
			antialias,
			logarithmicDepthBuffer,
			stencil,
			alpha: true,
			precision: "highp",
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.domElement.tabIndex = 0;
		return renderer;
	}

	/**
	 * Create camera
	 * @returns camera
	 */
	private _createCamera() {
		const camera = new PerspectiveCamera(70, 1, 100, 5e7);
		camera.position.set(0, 2.8e7, 0);
		return camera;
	}

	/**
	 * Create map controls
	 * @returns MapControls
	 */
	private _createControls() {
		const controls = new MapControls(this.camera, this.renderer.domElement);
		const MAX_POLAR_ANGLE = 1.2;

		controls.target.set(0, 0, -3e3);
		controls.screenSpacePanning = false;
		controls.minDistance = 10;
		controls.maxDistance = 3e7;
		controls.maxPolarAngle = MAX_POLAR_ANGLE;
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.keyPanSpeed = 5;
		controls.panSpeed = 2;
		controls.zoomToCursor = true;

		controls.listenToKeyEvents(this.renderer.domElement);

		// Adjust zinear/far and azimuth/polar when controls changed
		controls.addEventListener("change", () => {
			// Get the current polar angle and distance
			const polar = Math.max(controls.getPolarAngle(), 0.1);
			const dist = Math.max(controls.getDistance(), 100);

			// Set ther zoom speed based on distance
			controls.zoomSpeed = Math.max(Math.log(dist / 1e3), 0) + 0.5;

			// Set the camera near/far based on distance and polayr angle
			this.camera.far = MathUtils.clamp((dist / polar) * 8, 100, 1e8);
			this.camera.near = this.camera.far / 1e3;
			this.camera.updateProjectionMatrix();

			// Set fog based on distance and polar angle
			if (this.scene.fog instanceof FogExp2) {
				this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.25;
			}

			// Set the azimuth/polar angles based on distance
			const DIST_THRESHOLD = 8e6;
			const isDistAboveThreshold = dist > DIST_THRESHOLD;
			controls.minAzimuthAngle = isDistAboveThreshold ? 0 : -Infinity;
			controls.maxAzimuthAngle = isDistAboveThreshold ? 0 : Infinity;

			// Set the polar angle based on distance
			const POLAR_BASE = 1e7;
			const POLAR_EXPONENT = 4;
			controls.maxPolarAngle = Math.min(Math.pow(POLAR_BASE / dist, POLAR_EXPONENT), MAX_POLAR_ANGLE);
		});
		return controls;
	}

	/**
	 * Create ambient light
	 * @returns AmbientLight
	 */
	private _createAmbLight() {
		const ambLight = new AmbientLight(0xffffff, 1);
		return ambLight;
	}

	/**
	 * Create directional light
	 * @returns DirectionalLight
	 */
	private _createDirLight() {
		const dirLight = new DirectionalLight(0xffffff, 1);
		dirLight.position.set(0, 2e3, 1e3);
		dirLight.target.position.copy(this.controls.target);
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
	}

	/**
	 * Threejs animation loop
	 */
	public animate() {
		this.update();
		this.controls.update();
		this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
		teweenUpdate();
	}

	/**
	 * Fly to a position
	 * @param centerPostion Map center target position (world coordinate)
	 * @param cameraPostion Camera target position (world coordinate)
	 * @param animate animate or not
	 */
	public flyTo(centerPostion: Vector3, cameraPostion: Vector3, animate = true, onComplete?: (obj: Vector3) => void) {
		this.controls.target.copy(centerPostion);
		if (animate) {
			const start = this.camera.position;
			new Tween(start)
				// fly to 10000km
				.to({ y: 1e7, z: 0 }, 500)
				// to taget
				.chain(
					new Tween(start)
						.to(cameraPostion, 2000)
						.easing(Easing.Quintic.Out)
						.onUpdate(() => [this.controls.dispatchEvent({ type: "change" })])
						.onComplete(obj => onComplete && onComplete(obj))
				)
				.start();
		} else {
			this.camera.position.copy(cameraPostion);
		}
	}

	/**
	 * Get current scens state
	 * @returns center position and camera position
	 */
	public getState() {
		return {
			centerPosition: this.controls.target,
			cameraPosition: this.camera.position,
		};
	}
}
