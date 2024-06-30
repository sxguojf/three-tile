import * as tt from "../../src";

//添加罗盘
export function showCompass(viewer: tt.plugin.GLViewer) {
	// viewer.controls.saveState();
	const compass = document.querySelector<HTMLElement>("#compass");
	const plane = document.querySelector<HTMLElement>("#compass-plane");
	const text = document.querySelector<HTMLElement>("#compass-text");
	if (compass && plane && text) {
		viewer.addEventListener("update", (_evt) => {
			plane.style.transform = `rotateX(${viewer.controls.getPolarAngle()}rad)`;
			text.style.transform = `rotate(${viewer.controls.getAzimuthalAngle()}rad)`;
		});
		compass.addEventListener("click", viewer.controls.reset);
	}
}
