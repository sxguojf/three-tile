/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FogExp2, Vector3 } from "three";

import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { Easing, Tween } from "three/examples/jsm/libs/tween.module.js";
import { BaseViewer, ViewerOptions } from "./BaseViewer";
import { TileMapControls } from "./TileMapControls";

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
		const controls = new TileMapControls(this.camera, this.renderer.domElement);
		controls.onChange = state => {
			const { polar, dist } = state;
			// Set fog based on distance and polar angle
			if (this.scene.fog instanceof FogExp2) {
				this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.2;
			}
		};
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
