/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import {
	AmbientLight,
	type BaseEvent,
	Clock,
	Color,
	DirectionalLight,
	EventDispatcher,
	FogExp2,
	type Object3DEventMap,
	PerspectiveCamera,
	Scene,
	Vector3,
	WebGLRenderer,
} from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { update as teweenUpdate } from "three/examples/jsm/libs/tween.module.js";

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
const velocity = new Vector3();
const direction = new Vector3();

/**
 * GlViewer event map
 */
export interface PLViewerEventMap extends Object3DEventMap {
	update: BaseEvent & { delta: number };
	resize: BaseEvent & { size: { width: number; height: number } };
}

/**
 * GlViewer options
 */
export type PLViewerOptions = {
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
export class PLViewer extends EventDispatcher<PLViewerEventMap> {
	public readonly scene: Scene;
	public readonly renderer: WebGLRenderer;

	public readonly camera: PerspectiveCamera;
	public readonly controls: PointerLockControls;
	public readonly ambLight: AmbientLight;
	public readonly dirLight: DirectionalLight;
	public container?: HTMLElement;
	public topScenes: Scene[] = [];
	private readonly _clock: Clock = new Clock();

	public cameraHeight = 8 * 1000;

	/** Container width */
	public get width() {
		return this.container?.clientWidth || 0;
	}

	/** Container height */
	public get height() {
		return this.container?.clientHeight || 0;
	}

	private _autoForward = false;
	public get autoForward() {
		return this._autoForward;
	}
	public set autoForward(value) {
		moveForward = value;
		this._autoForward = value;
	}

	/**
	 * Constructor
	 * @param container container element or selector string
	 * @param options GLViewer options
	 */
	constructor(container?: HTMLElement | string, options: PLViewerOptions = {}) {
		super();

		const { antialias = false, stencil = true, logarithmicDepthBuffer = true } = options;
		this.renderer = this._createRenderer(antialias, stencil, logarithmicDepthBuffer);
		this.scene = this._createScene();
		this.camera = this._createCamera();
		if (container) {
			this.addTo(container);
		}
		this.controls = this._createControls(this.camera, this.renderer.domElement);
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
		scene.fog = new FogExp2(backColor, 0.000005);
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
		});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.domElement.tabIndex = 0;
		renderer.domElement.style.outline = "none";
		return renderer;
	}

	/**
	 * Create camera
	 * @returns camera
	 */
	private _createCamera() {
		const camera = new PerspectiveCamera(70, 1, 100, 1e6);
		camera.position.set(0, camera.far / 2, 0);
		return camera;
	}

	private _createControls(camera: PerspectiveCamera, domElement: HTMLElement) {
		const controls = new PointerLockControls(camera, domElement);
		// controls.minPolarAngle = 1.55;
		controls.maxPolarAngle = Math.PI - 0.5;

		const onKeyDown = function (event: KeyboardEvent) {
			switch (event.code) {
				case "ArrowUp":
				case "KeyW":
					moveForward = true;
					break;

				case "ArrowLeft":
				case "KeyA":
					moveLeft = true;
					break;

				case "ArrowDown":
				case "KeyS":
					moveBackward = true;
					break;

				case "ArrowRight":
				case "KeyD":
					moveRight = true;
					break;

				case "Space":
					if (canJump) velocity.y += 5000;
					canJump = false;
					break;
			}
		};

		const onKeyUp = function (event: KeyboardEvent) {
			switch (event.code) {
				case "ArrowUp":
				case "KeyW":
					moveForward = false;
					break;

				case "ArrowLeft":
				case "KeyA":
					moveLeft = false;
					break;

				case "ArrowDown":
				case "KeyS":
					moveBackward = false;
					break;

				case "ArrowRight":
				case "KeyD":
					moveRight = false;
					break;
			}
		};
		document.addEventListener("keydown", onKeyDown);
		document.addEventListener("keyup", onKeyUp);

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
		const time = performance.now();
		const controls = this.controls;

		if (controls.isLocked) {
			moveForward ||= this.autoForward;
			const delta = (time - prevTime) / 500;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;

			velocity.y -= 9.8 * 1000.0 * delta; // 100.0 = mass

			direction.z = Number(moveForward) - Number(moveBackward);
			direction.x = Number(moveRight) - Number(moveLeft);
			direction.normalize();

			if (moveForward || moveBackward) velocity.z -= direction.z * this.cameraHeight * 5 * delta;
			if (moveLeft || moveRight) velocity.x -= direction.x * this.cameraHeight * 5 * delta;

			controls.moveRight(-velocity.x * delta);
			controls.moveForward(-velocity.z * delta);

			controls.object.position.y += velocity.y * delta; // new behavior

			if (controls.object.position.y < this.cameraHeight) {
				velocity.y = 0;
				controls.object.position.y = this.cameraHeight;
				canJump = true;
			}
		}

		prevTime = time;

		this.renderer.render(this.scene, this.camera);
	}

	/**
	 * Threejs animation loop
	 */
	public animate() {
		this.update();
		this.dispatchEvent({ type: "update", delta: this._clock.getDelta() });
		teweenUpdate();
	}
}
