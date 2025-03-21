import { TileMap } from "../../map";

export function getAttributions(map: TileMap) {
	const attributions = new Set<string>();
	const imgSources = Array.isArray(map.imgSource) ? map.imgSource : [map.imgSource];
	imgSources.forEach((source) => {
		const attr = source.attribution;
		attr && attributions.add(attr);
	});
	if (map.demSource) {
		const attr = map.demSource.attribution;
		attr && attributions.add(attr);
	}
	return Array.from(attributions);
}
