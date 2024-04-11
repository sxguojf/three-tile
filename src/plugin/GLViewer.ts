/**
 *@description: threejs 3D scene initalize
 *@author: Guojf
 *@date: 2023-04-05
 */

import {
	AmbientLight,
	Camera,
	Clock,
	Color,
	DirectionalLight,
	Event,
	EventDispatcher,
	FogExp2,
	MathUtils,
	Object3D,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
} from "three";

import { MapControls } from "three/examples/jsm/controls/MapControls";

// three-tile x-axis points East, y-axis points north, z-axis points up, different from threejs default, so changes Glodal Object UP point to (0,0,1).
Object3D.DEFAULT_UP.set(0, 0, 1);

/**
 * threejs scene viewer initialize class
 */
export class GLViewer extends EventDispatcher<Event> {
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
		this.controls.dispatchEvent({ type: "change", target: this.controls });
	}

	public get width() {
		return this.container.clientWidth;
	}

	public get height() {
		return this.container.clientHeight;
	}

	constructor(dom: HTMLElement, centerPositon = new Vector3(0, 3e3, 0), cameraPosition = new Vector3(0, -1e3, 1e4)) {
		super();
		this.container = dom;
		this.renderer = this._createRenderer();
		this.scene = this._createScene();
		this.camera = this._createCamera(cameraPosition);
		this.controls = this._createControls(centerPositon, this.camera, dom);
		this.ambLight = this._createAmbLight();
		this.scene.add(this.ambLight);
		this.dirLight = this._createDirLight();
		this.scene.add(this.dirLight);
		this.container.appendChild(this.renderer.domElement);
		window.addEventListener("resize", this.resize.bind(this));
		this.resize();
		this.animate();
	}

	private _createScene() {
		const scene = new Scene();
		const backColor = 0xdbf0ff;
		scene.background = new Color(backColor);
		scene.fog = new FogExp2(backColor, 0);
		return scene;
	}

	private _createRenderer() {
		const renderer = new WebGLRenderer({
			antialias: false,
			alpha: true,
			logarithmicDepthBuffer: true,
			precision: "highp",
		});
		renderer.debug.checkShaderErrors = true;
		// renderer.shadowMap.enabled = true;
		renderer.toneMapping = 0;

		renderer.sortObjects = true;
		renderer.setPixelRatio(window.devicePixelRatio);
		return renderer;
	}

	private _createCamera(cameraPosition: Vector3) {
		const camera = new PerspectiveCamera(70, 1, 0.1, 50000);
		camera.position.copy(cameraPosition);
		return camera;
	}

	private _createControls(centerPositon: Vector3, camera: Camera, domElement: HTMLElement) {
		const controls = new MapControls(camera, domElement);
		controls.target.copy(centerPositon);
		controls.minDistance = 0.1;
		controls.maxDistance = 30000;
		controls.maxPolarAngle = 1.1;
		controls.enableDamping = true;
		controls.keyPanSpeed = 5;

		controls.listenToKeyEvents(window);
		controls.addEventListener("change", () => {
			// camera polar
			const polar = Math.max(this.controls.getPolarAngle(), 0.1);
			// dist of camera to controls
			const dist = Math.max(this.controls.getDistance(), 0.1);

			// set zoom speed from dist
			controls.zoomSpeed = Math.max(Math.log(dist), 1.8);

			// set far and near from dist/polar
			this.camera.far = MathUtils.clamp((dist / polar) * 8, 100, 50000);
			this.camera.near = this.camera.far / 1000;
			this.camera.updateProjectionMatrix();

			// set fog density from dist/polar
			if (this.scene.fog instanceof FogExp2) {
				this.scene.fog.density = (polar / (dist + 5) / 4) * this.fogFactor;
			}

			// set azimuth to 0 when dist>800
			if (dist > 8000) {
				controls.minAzimuthAngle = 0;
				controls.maxAzimuthAngle = 0;
			} else {
				controls.minAzimuthAngle = -Infinity;
				controls.maxAzimuthAngle = Infinity;
			}

			// set max polar from dist
			controls.maxPolarAngle = Math.min(Math.pow(10000, 4) / Math.pow(dist, 4), 1.1);
		});
		controls.saveState();
		return controls;
	}

	private _createAmbLight() {
		const ambLight = new AmbientLight(0xffffff, 0.5);
		return ambLight;
	}

	private _createDirLight() {
		const dirLight = new DirectionalLight(0xffffff, 0.5);
		dirLight.target.position.copy(this.controls.target);
		dirLight.position.set(-1e3, -2e3, 1e4);
		return dirLight;
	}

	public resize() {
		const width = this.width,
			height = this.height;
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
		requestAnimationFrame(this.animate.bind(this));
	}
}
