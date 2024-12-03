/**
 *@description: threejs 3D scene initalize
 *@author: Guojf
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
	centerPostion?: Vector3;
	cameraPosition?: Vector3;
	antialias?: boolean;
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
			const {
				centerPostion = new Vector3(0, 0, -3000),
				cameraPosition = new Vector3(0, 30000, 0),
				antialias = false,
				logarithmicDepthBuffer = true,
			} = options;

			this.container = el;
			this.renderer = this._createRenderer(antialias, logarithmicDepthBuffer);
			this.scene = this._createScene();
			this.camera = this._createCamera(cameraPosition);
			this.controls = this._createControls(centerPostion);
			this.ambLight = this._createAmbLight();
			this.scene.add(this.ambLight);
			this.dirLight = this._createDirLight(centerPostion);
			this.scene.add(this.dirLight);
			this.container.appendChild(this.renderer.domElement);
			window.addEventListener("resize", this.resize.bind(this));
			this.resize();
			this.renderer.setAnimationLoop(this.animate.bind(this));
		} else {
			throw `${container} not found!}`;
		}
	}

	private _createScene() {
		const scene = new Scene();
		const backColor = 0xdbf0ff;
		scene.background = new Color(backColor);
		scene.fog = new FogExp2(backColor, 0);
		return scene;
	}

	private _createRenderer(antialias: boolean, logarithmicDepthBuffer: boolean) {
		const renderer = new WebGLRenderer({
			antialias,
			logarithmicDepthBuffer,
			stencil: true,
			depth: true,
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

	private _createCamera(pos: Vector3) {
		const camera = new PerspectiveCamera(70, 1, 0.1, 50000);
		camera.position.copy(pos);
		return camera;
	}

	private _createControls(centerPos: Vector3) {
		const controls = new MapControls(this.camera, this.container);
		controls.target.copy(centerPos);
		controls.screenSpacePanning = false;
		controls.minDistance = 0.1;
		controls.maxDistance = 30000;
		controls.maxPolarAngle = 1.2;
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controls.keyPanSpeed = 5;

		controls.listenToKeyEvents(window);
		controls.addEventListener("change", () => {
			// camera polar
			const polar = Math.max(this.controls.getPolarAngle(), 0.1);
			// dist of camera to controls
			const dist = Math.max(this.controls.getDistance(), 0.1);

			// set zoom speed on dist
			controls.zoomSpeed = Math.max(Math.log(dist), 1.8);

			// set far and near on dist/polar
			this.camera.far = MathUtils.clamp((dist / polar) * 8, 100, 50000);
			this.camera.near = this.camera.far / 1000;
			this.camera.updateProjectionMatrix();

			// set fog density on dist/polar
			if (this.scene.fog instanceof FogExp2) {
				this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.25;
			}

			// set azimuth to 0 when dist>800
			if (dist > 8000) {
				controls.minAzimuthAngle = 0;
				controls.maxAzimuthAngle = 0;
			} else {
				controls.minAzimuthAngle = -Infinity;
				controls.maxAzimuthAngle = Infinity;
			}

			// limit the max polar on dist
			controls.maxPolarAngle = Math.min(Math.pow(10000, 4) / Math.pow(dist, 4), 1.2);
		});
		return controls;
	}

	private _createAmbLight() {
		const ambLight = new AmbientLight(0xffffff, 1);
		return ambLight;
	}

	private _createDirLight(center: Vector3) {
		const dirLight = new DirectionalLight(0xffffff, 1);
		// dirLight.position.set(-1e3, 1e4, -2e3);
		dirLight.position.set(0, 2e3, 1e3);
		dirLight.target.position.copy(center);
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

		this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
	}
}
