import { Camera, Vector2, Vector3 } from "three";
import { TileMap } from "three-tile";

export function getLocalFromMouse(mouseEvent: MouseEvent, map: TileMap, camera: Camera): Vector3 | undefined {
	// const currentTarget = mouseEvent.currentTarget;
	// let x = mouseEvent.offsetX;
	// let y = mouseEvent.offsetY;
	// if (x === undefined) {
	// 	const { left, top } = (currentTarget as HTMLDivElement).getBoundingClientRect();
	// 	x = mouseEvent.clientX - left;
	// 	y = mouseEvent.clientY - top;
	// }
	const { currentTarget, offsetX, offsetY } = mouseEvent;
	if (currentTarget instanceof HTMLElement) {
		const width = currentTarget.clientWidth;
		const height = currentTarget.clientHeight;
		const pointer = new Vector2((offsetX / width) * 2 - 1, -(offsetY / height) * 2 + 1);
		const info = map.getLocalInfoFromScreen(camera, pointer);
		return info?.location;
	} else {
		throw new Error("mouseEvent.currentTarget is not HTMLElement!");
	}
}

export function getAttributions(map: TileMap) {
	const attributions = new Set<string>();
	const imgSources = Array.isArray(map.imgSource) ? map.imgSource : [map.imgSource];
	imgSources.forEach(source => {
		const attr = source.attribution;
		attr && attributions.add(attr);
	});
	if (map.demSource) {
		const attr = map.demSource.attribution;
		attr && attributions.add(attr);
	}
	return Array.from(attributions);
}
