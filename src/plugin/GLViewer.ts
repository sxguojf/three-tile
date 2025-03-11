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

import { MapControls } from "three/examples/jsm/controls/MapControls";
import { Easing, Tween, update as teweenUpdate } from "three/examples/jsm/libs/tween.module.js";

/**
 * GlViewer event map
 */
export interface GLViewerEventMap extends Object3DEventMap {
	update: BaseEvent & { delta: number };
}

/**
 * GlViewer options
 */
type GLViewerOptions = {
	antialias?: boolean;
	stencil?: boolean;
	logarithmicDepthBuffer?: boolean;
};

/**
 * threejs scene viewer initialize class
 */
export class GLViewer extends EventDispatcher<GLViewerEventMap> {
	public readonly scene: Scene;
	public readonly renderer: WebGLRenderer;
	public readonly camera: PerspectiveCamera;
	public readonly controls: MapControls;
	public readonly ambLight: AmbientLight;
	public readonly dirLight: DirectionalLight;
	public readonly container: HTMLElement;
	private readonly _clock: Clock = new Clock();

	private _fogFactor = 1.0;
	public get fogFactor() {
		return this._fogFactor;
	}
	public set fogFactor(value) {
		this._fogFactor = value;
		this.controls.dispatchEvent({ type: "change" });
	}

	public get width() {
		return this.container.clientWidth;
	}

	public get height() {
		return this.container.clientHeight;
	}

	constructor(container: HTMLElement | string, options: GLViewerOptions = {}) {
		super();
		const el = typeof container === "string" ? document.querySelector(container) : container;
		if (el instanceof HTMLElement) {
			const { antialias = false, stencil = true, logarithmicDepthBuffer = true } = options;

			this.container = el;
			this.renderer = this._createRenderer(antialias, stencil, logarithmicDepthBuffer);
			this.scene = this._createScene();
			this.camera = this._createCamera();
			this.controls = this._createControls();
			this.ambLight = this._createAmbLight();
			this.scene.add(this.ambLight);
			this.dirLight = this._createDirLight();
			this.scene.add(this.dirLight);
			this.scene.add(this.dirLight.target);
			this.container.appendChild(this.renderer.domElement);
			window.addEventListener("resize", this.resize.bind(this));
			this.resize();
			this.renderer.setAnimationLoop(this.animate.bind(this));
		} else {
			throw new Error(`${container} not found!`);
		}
	}

	private _createScene() {
		const scene = new Scene();
		const backColor = 0xdbf0ff;
		scene.background = new Color(backColor);
		scene.fog = new FogExp2(backColor, 0);
		return scene;
	}

	private _createRenderer(antialias: boolean, stencil: boolean, logarithmicDepthBuffer: boolean) {
		const renderer = new WebGLRenderer({
			antialias,
			logarithmicDepthBuffer,
			stencil,
			alpha: true,
			precision: "highp",
		});
		// renderer.debug.checkShaderErrors = true;
		// renderer.toneMapping = 3;
		// renderer.toneMappingExposure = 1;
		// renderer.sortObjects = false;
		renderer.setPixelRatio(window.devicePixelRatio);

		return renderer;
	}

	private _createCamera() {
		const camera = new PerspectiveCamera(70, 1, 0.1, 50000);
		camera.position.set(0, 30000, 0);
		return camera;
	}
	private _createControls() {
		const DIST_THRESHOLD = 8000;
		const POLAR_BASE = 10000;
		const POLAR_EXPONENT = 4;
		const MAX_POLAR_ANGLE = 1.2;

		const controls = new MapControls(this.camera, this.container);
		controls.target.set(0, 0, -3000);
		controls.screenSpacePanning = false;
		controls.minDistance = 0.1;
		controls.maxDistance = 30000;
		controls.maxPolarAngle = MAX_POLAR_ANGLE;
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.keyPanSpeed = 5;

		this.container.tabIndex = 0;
		controls.listenToKeyEvents(this.container);

		// Adjust zinear/far and azimuth/polar when controls changed
		controls.addEventListener("change", () => {
			const polar = Math.max(controls.getPolarAngle(), 0.1);
			const dist = Math.max(controls.getDistance(), 0.1);

			controls.zoomSpeed = Math.max(Math.log(dist), 0) + 0.5;

			this.camera.far = MathUtils.clamp((dist / polar) * 8, 100, 50000);
			this.camera.near = this.camera.far / 1000;
			this.camera.updateProjectionMatrix();

			if (this.scene.fog instanceof FogExp2) {
				this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.25;
			}

			const isDistAboveThreshold = dist > DIST_THRESHOLD;
			controls.minAzimuthAngle = isDistAboveThreshold ? 0 : -Infinity;
			controls.maxAzimuthAngle = isDistAboveThreshold ? 0 : Infinity;

			controls.maxPolarAngle = Math.min(Math.pow(POLAR_BASE / dist, POLAR_EXPONENT), MAX_POLAR_ANGLE);
		});
		return controls;
	}

	private _createAmbLight() {
		const ambLight = new AmbientLight(0xffffff, 1);
		return ambLight;
	}

	private _createDirLight() {
		const dirLight = new DirectionalLight(0xffffff, 1);
		dirLight.position.set(0, 2e3, 1e3);
		dirLight.target.position.copy(this.controls.target);
		return dirLight;
	}

	public resize() {
		const width = this.width;
		const height = this.height;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(width, height);
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		return this;
	}

	private animate() {
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		teweenUpdate();
		this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
	}

	/**
	 * Fly to a position
	 * @param centerPostion Map center target position
	 * @param cameraPostion Camera target position
	 * @param animate animate or not
	 */
	public flyTo(centerPostion: Vector3, cameraPostion: Vector3, animate = true, onComplete?: (obj: Vector3) => void) {
		this.controls.target.copy(centerPostion);
		if (animate) {
			const start = this.camera.position;
			new Tween(start)
				// fly to 10000km
				.to({ y: 10000, z: 0 }, 500)
				// to taget
				.chain(
					new Tween(start)
						.to(cameraPostion, 2000)
						.easing(Easing.Quintic.Out)
						.onComplete((obj) => onComplete && onComplete(obj)),
				)

				.start();
		} else {
			this.camera.position.copy(cameraPostion);
		}
	}
}
