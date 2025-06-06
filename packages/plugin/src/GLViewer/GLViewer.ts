/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FogExp2, MathUtils, Vector3 } from "three";

import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { Easing, Tween } from "three/examples/jsm/libs/tween.module.js";
import { BaseViewer, ViewerOptions } from "./BaseViewer";

/**
 * Threejs scene initialize class
 */
export class GLViewer extends BaseViewer {
	public controls: MapControls;

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

	/**
	 * Constructor
	 * @param container container element or selector string
	 * @param options GLViewer options
	 */
	constructor(container?: HTMLElement | string, options: ViewerOptions = {}) {
		super(container, options);
		this.controls = this._createControls();
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
				this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.2;
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
	 * Threejs animation loop
	 */
	public animate() {
		super.animate();
		this.controls.update();
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
