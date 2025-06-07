import { Camera, MathUtils, PerspectiveCamera } from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

/**
 * Tile map controls
 */
export class TileMapControls extends MapControls {
	constructor(camera: Camera, domElement: HTMLElement) {
		super(camera, domElement);
		const MAX_POLAR_ANGLE = 1.2;

		this.target.set(0, 0, -3e3);
		this.screenSpacePanning = false;
		this.minDistance = 10;
		this.maxDistance = 3e7;
		this.maxPolarAngle = MAX_POLAR_ANGLE;
		this.enableDamping = true;
		this.dampingFactor = 0.1;
		this.keyPanSpeed = 5;
		this.panSpeed = 2;
		this.zoomToCursor = true;

		this.listenToKeyEvents(domElement);

		// Adjust zinear/far and azimuth/polar when controls changed
		this.addEventListener("change", () => {
			// Get the current polar angle and distance
			const polar = Math.max(this.getPolarAngle(), 0.01);
			const dist = Math.max(this.getDistance(), 1);
			const azimuth = this.getAzimuthalAngle();

			// Set ther zoom speed based on distance
			this.zoomSpeed = Math.max(Math.log(dist / 1e3), 0) + 0.5;

			// Set the azimuth/polar angles based on distance
			const DIST_THRESHOLD = 8e6;
			const isDistAboveThreshold = dist > DIST_THRESHOLD;
			this.minAzimuthAngle = isDistAboveThreshold ? 0 : -Infinity;
			this.maxAzimuthAngle = isDistAboveThreshold ? 0 : Infinity;

			// Set the polar angle based on distance
			const POLAR_BASE = 1e7;
			const POLAR_EXPONENT = 4;
			this.maxPolarAngle = Math.min(Math.pow(POLAR_BASE / dist, POLAR_EXPONENT), MAX_POLAR_ANGLE);

			if (camera instanceof PerspectiveCamera) {
				camera.far = MathUtils.clamp((dist / polar) * 8, 2e4, 5e7);
				camera.near = Math.max(camera.far / 1e4, 1);
				camera.updateProjectionMatrix();
			}

			this.onChange({ polar, dist, azimuth });
		});
	}

	public onChange(_state: { polar: number; dist: number; azimuth: number }) {}
}
