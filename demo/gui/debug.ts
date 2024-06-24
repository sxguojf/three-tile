import * as tt from "../../src";

// 状态栏显示瓦片信息
export function updateDebug(map: tt.TileMap, viewer: tt.plugin.GLViewer) {
	viewer.addEventListener("update", (evt) => {
		const debug = document.querySelector("#debug");
		if (debug) {
			const controls = JSON.stringify(
				{
					distance: viewer.controls.getDistance().toFixed(2),
					azimuthal: viewer.controls.getAzimuthalAngle().toFixed(2),
					polar: viewer.controls.getPolarAngle().toFixed(2),
				},
				null,
				2,
			);
			const cameraInfo = JSON.stringify(
				{
					x: viewer.camera.position.x.toFixed(2),
					y: viewer.camera.position.y.toFixed(2),
					z: viewer.camera.position.z.toFixed(2),
					near: viewer.camera.near.toFixed(3),
					far: viewer.camera.far.toFixed(3),
				},
				null,
				2,
			);
			const elevation = JSON.stringify(
				{
					avg: (map.avgZInView * 1000).toFixed(1),
					max: (map.maxZInView * 1000).toFixed(1),
					min: (map.minZInView * 1000).toFixed(1),
				},
				null,
				2,
			);

			const renderInfo = JSON.stringify(
				Object.assign({}, viewer.renderer.info.render, {
					FPS: Math.round(1 / evt.delta),
				}),
				null,
				2,
			);

			const tileTree = JSON.stringify(map.tileCount, null, 2);
			const memory = JSON.stringify(viewer.renderer.info.memory, null, 2);
			const info = `<b>Tiles:</b> ${tileTree}
<b>Elevation:</b> ${elevation}
<b>Camera:</b> ${cameraInfo}
<b>Controls:</b> ${controls}
<b>Memory:</b> ${memory}
<b>Render:</b> ${renderInfo}`;
			debug.innerHTML = info.replaceAll('"', "").replaceAll("{", "").replaceAll("}", "");
		}
	});
}
