/**
 *@description: Threejs 3D scene initalize
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { Box3, FogExp2, MathUtils, Object3D, Sphere, Vector3 } from "three";

import { Easing, Tween } from "three/examples/jsm/libs/tween.module.js";
import { BaseViewer, ViewerOptions } from "./BaseViewer";
import { TileMapControls } from "./TileMapControls";

/**
 * Threejs scene initialize class
 */
export class GLViewer extends BaseViewer {
	public controls: TileMapControls;

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

	public get controlsMode() {
		return this.controls.controlsMode;
	}
	public set controlsMode(value) {
		this.controls.controlsMode = value;
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
				this.scene.fog.density = (polar / (dist + 1)) * this.fogFactor * 0.2;
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
	 */
	public flyToObject(
		object: Object3D,
		offset: {
			azimuthDeg?: number; // 方位角
			pitchDeg?: number; // 俯仰角
			distanceMultiplier?: number; // 距离乘数
			animate?: boolean; // 是否动画
		} = { azimuthDeg: 0, pitchDeg: 30, distanceMultiplier: 1.2, animate: true }
	): Promise<void> {
		const getShpere = (object: Object3D) => {
			const box = new Box3().setFromObject(object); // 计算模型的包围盒
			const sphere = box.getBoundingSphere(new Sphere()); // 转换为包围球
			sphere.center.setY(box.min.y);
			return sphere;
		};

		const { center, radius } = getShpere(object);

		// 计算相机距离
		const distance = radius / Math.sin(MathUtils.degToRad(this.camera.fov / 2));

		const { azimuthDeg = 0, pitchDeg = 30, distanceMultiplier = 1.5, animate = true } = offset;

		// 计算相机位置
		const cameraPostion = new Vector3()
			.setFromSphericalCoords(
				distance * distanceMultiplier,
				MathUtils.degToRad(90 - pitchDeg),
				// MathUtils.degToRad(90),
				MathUtils.degToRad(azimuthDeg)
			)
			.add(center.clone().setY(0));

		this.controls.target.copy(center);
		if (animate) {
			const start = this.camera.position;
			return new Promise(resolve => {
				new Tween(start)
					// to taget
					.chain(
						new Tween(start)
							.to(cameraPostion, 2000)
							.easing(Easing.Quintic.Out)
							.onUpdate(() => {
								this.controls.dispatchEvent({ type: "change" });
								const shpere = getShpere(object);
								this.controls.target.copy(shpere.center);
							})
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
