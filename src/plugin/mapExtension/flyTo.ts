// import { Vector3 } from "three";
// import { Easing, Tween } from "three/examples/jsm/libs/tween.module";

// /**
//  * 飞行到某世界坐标
//  * @param cameraPos 目标摄像机世界坐标
//  * @param centerPos 目标地图中心世界坐标
//  */
// const flyToPos = (cameraPos: Vector3, centerPos: Vector3) => {
// 	viewer.controls.target.copy(centerPos);
// 	const start = viewer.camera.position;
// 	new Tween(start)
// 		// 先到10000km高空
// 		.to({ y: 10000, z: 0 }, 500)
// 		// 再到目标位置
// 		.chain(new Tween(start).to(cameraPos, 2000).easing(Easing.Quintic.Out))
// 		.start();
// };

// /**
//  * 飞行到某地理坐标
//  * @param newCameraGeo 目标摄像机经纬度坐标
//  * @param newcenterGeo 目标地图中心经纬度坐标
//  */
// const flyToGeo = (newCameraGeo: Vector3, newcenterGeo: Vector3) => {
// 	const cameraPosition = map.geo2world(newCameraGeo);
// 	const centerPosition = map.geo2world(newcenterGeo);
// 	flyToPos(cameraPosition, centerPosition);
// };
