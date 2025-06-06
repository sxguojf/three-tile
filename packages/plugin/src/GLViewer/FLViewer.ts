/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
import { BaseViewer, ViewerOptions } from "./BaseViewer";

/**
 * Threejs scene initialize class with FlyControls
 */
export class FLViewer extends BaseViewer {
	public controls: FlyControls;

	public get autoForward() {
		return this.controls.autoForward;
	}
	public set autoForward(value) {
		this.controls.autoForward = value;
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
		const controls = new FlyControls(this.camera, this.renderer.domElement);
		controls.autoForward = false;
		controls.movementSpeed = 2000;
		controls.rollSpeed = 0.05;
		return controls;
	}

	/**
	 * Threejs animation loop
	 */
	public animate() {
		super.animate();
		const delta = this.clock.getDelta();
		this.controls.update(delta);
	}
}
