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
	 */
	public flyToObject(
		object: Object3D,
		offset: {
			azimuthDeg: number; // 方位角
			pitchDeg: number; // 俯仰角
			distanceMultiplier: number; // 距离乘数
		} = { azimuthDeg: 0, pitchDeg: 20, distanceMultiplier: 1.5 },
		animate = true
	): Promise<void> {
		const box = new Box3().setFromObject(object); // 计算模型的包围盒
		const sphere = box.getBoundingSphere(new Sphere()); // 转换为包围球
		const center = sphere.center; // 包围球中心点
		const radius = sphere.radius; // 包围球半径

		this.controls.target.copy(center);

		// 计算相机距离
		const distance = radius / Math.sin(MathUtils.degToRad(this.camera.fov / 2));

		const { azimuthDeg = 0, pitchDeg = 20, distanceMultiplier = 1.5 } = offset;

		// 计算相机位置
		const cameraPostion = new Vector3()
			.setFromSphericalCoords(
				distance * distanceMultiplier,
				Math.PI / 2 - MathUtils.degToRad(pitchDeg),
				MathUtils.degToRad(azimuthDeg)
			)
			.add(center);

		return this.flyTo(center, cameraPostion, animate);
	}

	/**
	 * 飞向包围球动画
	 * @param {number} azimuthDeg 方位角(度)
	 * @param {number} pitchDeg 俯仰角(度)
	 * @param {number} [distanceMultiplier=3] 距离乘数
	 * @param {number} [duration=2000] 动画时长(毫秒)
	 */
	public flyToBoundingSphere(
		model: Object3D,
		azimuthDeg: number,
		pitchDeg: number,
		distanceMultiplier = 1,
		duration = 2000
	) {
		// 计算模型包围球
		// model.geometry.computeBoundingSphere();
		// const boundingSphere = model.geometry.boundingSphere!;
		const box = new Box3().setFromObject(model); // 计算模型的包围盒
		const boundingSphere = box.getBoundingSphere(new Sphere()); // 转换为包围球
		const center = boundingSphere.center; // 包围球中心点

		this.controls.target.copy(center);

		// 转换角度为弧度
		const azimuth = MathUtils.degToRad(azimuthDeg);
		const pitch = MathUtils.degToRad(pitchDeg);

		// 计算相机距离
		const distance = boundingSphere.radius * distanceMultiplier;

		// 计算目标位置(球坐标转笛卡尔坐标)
		const targetPosition = new Vector3();
		targetPosition
			.setFromSphericalCoords(
				distance,
				Math.PI / 2 - pitch, // 极角 = π/2 - pitch
				azimuth
			)
			.add(boundingSphere.center);

		// 创建位置动画
		new Tween(this.camera.position).to(targetPosition, duration).easing(Easing.Quadratic.InOut).start();

		// 创建旋转动画(使相机始终看向模型中心)
		// const targetQuaternion = new Quaternion();
		// targetQuaternion.setFromRotationMatrix(
		// 	new Matrix4().lookAt(
		// 		targetPosition,
		// 		boundingSphere.center,
		// 		new Vector3(0, 1, 0) // 上方向为Y轴
		// 	)
		// );

		// new Tween(this.camera.quaternion).to(targetQuaternion, duration).easing(Easing.Quadratic.InOut).start();
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
