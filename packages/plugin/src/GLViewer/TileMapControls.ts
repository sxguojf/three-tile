import { Camera, MathUtils, MOUSE, PerspectiveCamera, TOUCH } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

/**
 * Tile map controls
 */
export class TileMapControls extends OrbitControls {
	/**
	 * Map max polar angle, default is Math.PI / 2.1
	 */
	public mapMaxPolarAngle: number = Math.PI / 2.1;

	/**
	 * Rest azimuth when distance > restAzimuthDist, default is 8e6
	 */
	public restAzimuthDist = 8e6;

	/**
	 * Whether to use dynamic zoom speed whit distance, default is true
	 */
	public dymamicZoomSpeed = true;

	private _controlsMode: "MAP" | "ORBIT" = "MAP";
	public get controlsMode(): "MAP" | "ORBIT" {
		return this._controlsMode;
	}
	public set controlsMode(value: "MAP" | "ORBIT") {
		this._controlsMode = value;
		if (this.controlsMode.toUpperCase() === "MAP") {
			this.mouseButtons = { LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE };
			this.touches = { ONE: TOUCH.PAN, TWO: TOUCH.DOLLY_ROTATE };
			// this.zoomToCursor = true;
		} else {
			this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN };
			this.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
			// this.zoomToCursor = false;
		}
	}

	constructor(camera: Camera, domElement: HTMLElement) {
		super(camera, domElement);

		this.controlsMode = "MAP";
		this.screenSpacePanning = false;

		this.minDistance = 10;
		this.maxDistance = 3e7;
		this.maxPolarAngle = 1.2;
		this.enableDamping = true;
		this.dampingFactor = 0.1;
		this.keyPanSpeed = 5;

		this.listenToKeyEvents(domElement);
		this.addEventListener("change", this.onChange.bind(this));
	}

	// Adjust zinear/far and azimuth/polar when controls changed
	public onChange() {
		const polar = Math.max(this.getPolarAngle(), 0.01);
		const dist = Math.max(this.getDistance(), 1);

		// Set ther zoom speed based on distance
		if (this.dymamicZoomSpeed) {
			this.zoomSpeed = Math.max(Math.log(dist / 1e3), 1);
			// this.panSpeed = Math.max(Math.log(dist) / 9, 0.1);
		}

		// Set the azimuth/polar angles based on distance
		const isDistAboveThreshold = dist > this.restAzimuthDist;
		this.minAzimuthAngle = isDistAboveThreshold ? 0 : -Infinity;
		this.maxAzimuthAngle = isDistAboveThreshold ? 0 : Infinity;

		// Set the polar angle based on distance
		this.maxPolarAngle = Math.min(Math.pow(1e7 / dist, 2), this.mapMaxPolarAngle);

		const camera = this.object;
		if (camera instanceof PerspectiveCamera) {
			// todo 精确推导far/near计算公式
			camera.far = MathUtils.clamp((dist / (polar / 1.5)) * 7, 2e4, this.maxDistance * 2);
			camera.near = Math.max(camera.far / 5e4, this.minDistance);
			camera.updateProjectionMatrix();
		}
	}
}
