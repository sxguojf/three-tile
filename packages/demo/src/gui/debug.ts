import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

// 状态栏显示瓦片信息
export function showDebug(map: tt.TileMap, viewer: plugin.GLViewer) {
	viewer.addEventListener("update", evt => {
		const debug = document.querySelector("#debug");
		if (debug) {
			const controls = JSON.stringify(
				{
					distance: viewer.controls.getDistance().toFixed(0),
					azimuthal: viewer.controls.getAzimuthalAngle().toFixed(3),
					polar: viewer.controls.getPolarAngle().toFixed(3),
					targetX: viewer.controls.target.x.toFixed(0),
					targetY: viewer.controls.target.y.toFixed(0),
					targetZ: viewer.controls.target.z.toFixed(0),
				},
				null,
				2
			);
			const cameraInfo = JSON.stringify(
				{
					x: viewer.camera.position.x.toFixed(0),
					y: viewer.camera.position.y.toFixed(0),
					z: viewer.camera.position.z.toFixed(0),
					near: viewer.camera.near.toFixed(0),
					far: viewer.camera.far.toFixed(0),
				},
				null,
				2
			);

			const renderInfo = JSON.stringify(
				Object.assign({}, viewer.renderer.info.render, {
					FPS: Math.round(1 / evt.delta),
				}),
				null,
				2
			);

			const tileTree = JSON.stringify(map.getTileCount(), null, 2);
			const memory = JSON.stringify(viewer.renderer.info.memory, null, 2);
			const info = `<b>Tiles:</b> ${tileTree}
<b>Camera:</b> ${cameraInfo}
<b>Controls:</b> ${controls}
<b>Memory:</b> ${memory}
<b>Render:</b> ${renderInfo}`;
			debug.innerHTML = info.replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
		}
	});
}
