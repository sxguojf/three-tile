import { Camera, MathUtils, PerspectiveCamera } from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

/**
 * Tile map controls
 */
export class TileMapControls extends MapControls {
	/**
	 * Map max polar angle, default is Math.PI / 2.5
	 */
	public mapMaxPolarAngle: number = Math.PI / 2.5;

	/**
	 * Rest azimuth when distance > restAzimuthDist, default is 8e6
	 */
	public restAzimuthDist = 8e6;

	/**
	 * Whether to use dynamic zoom speed whit distance, default is true
	 */
	public dymamicZoomSpeed = true;

	constructor(camera: Camera, domElement: HTMLElement) {
		super(camera, domElement);

		this.screenSpacePanning = false;
		this.zoomToCursor = true;

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
			this.zoomSpeed = Math.max(Math.log(dist / 1e3), 0.5);
		}

		// Set the azimuth/polar angles based on distance
		const isDistAboveThreshold = dist > this.restAzimuthDist;
		this.minAzimuthAngle = isDistAboveThreshold ? 0 : -Infinity;
		this.maxAzimuthAngle = isDistAboveThreshold ? 0 : Infinity;

		// Set the polar angle based on distance
		this.maxPolarAngle = Math.min(Math.pow(1e7 / dist, 4), this.mapMaxPolarAngle);

		const camera = this.object;
		if (camera instanceof PerspectiveCamera) {
			// todo 精确推导far/near计算公式
			camera.far = MathUtils.clamp((dist / polar) * 8, 2e4, this.maxDistance * 2);
			camera.near = Math.max(camera.far / 1e5, this.minDistance);
			camera.updateProjectionMatrix();
		}
	}
}
