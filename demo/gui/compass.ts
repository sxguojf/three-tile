import * as tt from "../../src";

//更新罗盘
export function addCompass(viewer: tt.plugin.GLViewer) {
	const plane = document.querySelector<SVGElement>("#compass-plane");
	const text = document.querySelector<HTMLSpanElement>("#compass-text");
	if (plane && text) {
		viewer.addEventListener("update", (_evt) => {
			plane.style.transform = `rotateX(${viewer.controls.getPolarAngle()}rad)`;
			text.style.transform = `rotate(${viewer.controls.getAzimuthalAngle()}rad)`;
		});
	}
}
