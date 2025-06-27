import { Camera, Vector2, Vector3 } from "three";
import { TileMap } from "three-tile";

export function getLocalFromMouse(
	mouseEvent: { currentTarget: any; clientX: number; clientY: number },
	map: TileMap,
	camera: Camera
): Vector3 | undefined {
	const { currentTarget: target, clientX: x, clientY: y } = mouseEvent;
	if (target instanceof HTMLElement) {
		const width = target.clientWidth;
		const height = target.clientHeight;
		const pointer = new Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1);
		const info = map.getLocalInfoFromScreen(camera, pointer);
		return info?.location;
	} else {
		return undefined;
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
