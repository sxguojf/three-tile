import * as tt from "three-tile";
import * as plugin from "three-tile-plugin";

export function showDebug(map: tt.TileMap, viewer: plugin.GLViewer) {
	const debugElement = document.querySelector<HTMLDivElement>("#debug");
	if (!debugElement) {
		return;
	}

	const updateHandler = (evt: { delta: number }) => {
		try {
			const controls = {
				distance: viewer.controls.getDistance().toFixed(0),
				azimuthal: viewer.controls.getAzimuthalAngle().toFixed(3),
				polar: viewer.controls.getPolarAngle().toFixed(3),
				targetX: viewer.controls.target.x.toFixed(0),
				targetY: viewer.controls.target.y.toFixed(0),
				targetZ: viewer.controls.target.z.toFixed(0),
				zoomSpeed: viewer.controls.zoomSpeed.toFixed(2),
			};

			const cameraInfo = {
				x: viewer.camera.position.x.toFixed(0),
				y: viewer.camera.position.y.toFixed(0),
				z: viewer.camera.position.z.toFixed(0),
				near: viewer.camera.near.toFixed(0),
				far: viewer.camera.far.toFixed(0),
			};

			const renderInfo = {
				...viewer.renderer.info.render,
				FPS: Math.round(1 / evt.delta),
			};

			const tileTree = map.getTileCount();
			const memory = viewer.renderer.info.memory;

			debugElement.innerHTML = `
<b>瓦片:</b> ${JSON.stringify(tileTree).replace(/[{}"]/g, "")}
<b>摄像机:</b> ${JSON.stringify(cameraInfo).replace(/[{}"]/g, "")}
<b>控制器:</b> ${JSON.stringify(controls).replace(/[{}"]/g, "")}
<b>模型:</b> ${JSON.stringify(memory).replace(/[{}"]/g, "")}
<b>渲染:</b> ${JSON.stringify(renderInfo).replace(/[{}"]/g, "")}
            `.trim();
		} catch (error) {
			console.warn("Debug info update failed:", error);
		}
	};

	viewer.addEventListener("update", updateHandler);

	return () => {
		viewer.removeEventListener("update", updateHandler);
	};
}
