import { MOUSE, TOUCH } from "three";
import { GLViewer } from "./GLViewer";
import { ViewerOptions } from "./BaseViewer";

/**
 * Threejs scene initialize class with OrbitControls.
 */
export class OrbitViewer extends GLViewer {
	constructor(container?: HTMLElement | string, options: ViewerOptions = {}) {
		super(container, options);
		this.controls.mouseButtons = {
			LEFT: MOUSE.ROTATE,
			MIDDLE: MOUSE.DOLLY,
			RIGHT: MOUSE.PAN,
		};
		this.controls.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
	}
}
