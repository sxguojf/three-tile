/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Box3, FogExp2, Object3D, Sphere, Vector3 } from "three";

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
		controls.addEventListener("change", () => {
			if (this.scene.fog instanceof FogExp2) {
				const polar = controls.getPolarAngle();
				const dist = controls.getDistance();
				this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.2;
			}
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
	public flyTo(centerPostion: Vector3, cameraPostion: Vector3, animate = true): Promise<void> {
		this.controls.target.copy(centerPostion);
		if (animate) {
			const start = this.camera.position;
			return new Promise(resolve => {
				new Tween(start)
					// fly to 10000km
					.to({ y: 1e7, z: 0 }, 500)
					// to taget
					.chain(
						new Tween(start)
							.to(cameraPostion, 2000)
							.easing(Easing.Quintic.Out)
							.onUpdate(() => [this.controls.dispatchEvent({ type: "change" })])
							.onComplete(() => resolve())
					)
					.start();
			});
		} else {
			this.camera.position.copy(cameraPostion);
			return Promise.resolve();
		}
	}

	/**
	 * Fly to a object
	 * @param object Object3D target object
	 * @param offset Camera offset from object center
	 * @param animate animate or not
	 */
	public flyToObject(object: Object3D, offset = new Vector3(), animate = true): Promise<void> {
		const box = new Box3().setFromObject(object); // 计算模型的包围盒
		const sphere = box.getBoundingSphere(new Sphere()); // 转换为包围球
		const center = sphere.center; // 包围球中心点
		const radius = sphere.radius; // 包围球半径

		this.controls.target.copy(center);

		// 计算相机距离
		const fov = this.camera.fov * (Math.PI / 180); // 转弧度
		const distance = radius / Math.sin(fov / 2); // 基于 FOV 计算距离

		const cameraPostion = center.clone().add(new Vector3(0, 0, distance).add(offset));

		return this.flyTo(center, cameraPostion, animate);
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
