/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { PerspectiveCamera, Vector3 } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { BaseViewer, ViewerOptions } from "./BaseViewer";

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();
const velocity = new Vector3();
const direction = new Vector3();

/**
 * Threejs scene initialize class with PointerLockControls.
 */
export class PLViewer extends BaseViewer {
	public controls: PointerLockControls;
	public cameraHeight = 8000;

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
	constructor(container?: HTMLElement | string, options: ViewerOptions = {}) {
		super(container, options);
		this.controls = this.createControls(this.camera, this.renderer.domElement);
	}

	private createControls(camera: PerspectiveCamera, domElement: HTMLElement) {
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

	public update() {
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

		super.update();
	}
}
