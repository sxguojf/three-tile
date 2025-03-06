import { TileMap } from "../../map";

TileMap.prototype.getAttributions = function getAttributions() {
	const attributions = new Set<string>();
	const imgSources = Array.isArray(this.imgSource) ? this.imgSource : [this.imgSource];
	imgSources.forEach((source) => {
		const attr = source.attribution;
		attr && attributions.add(attr);
	});
	if (this.demSource) {
		const attr = this.demSource.attribution;
		attr && attributions.add(attr);
	}
	return Array.from(attributions);
};
