import * as tt from "../../src";

//更新罗盘
export function updateCompass(viewer: tt.plugin.GLViewer) {
	viewer.addEventListener("update", (_evt) => {
		const plane = document.querySelector<SVGElement>("#compass-plane");
		if (plane) {
			plane.style.transform = `rotateX(${viewer.controls.getPolarAngle()}rad)`;
		}
		const text = document.querySelector<HTMLSpanElement>("#compass-text");
		if (text) {
			text.style.transform = `rotate(${viewer.controls.getAzimuthalAngle()}rad)`;
		}
	});
}
