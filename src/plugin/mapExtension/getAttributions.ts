import { TileMap } from "../../map";

TileMap.prototype.getAttributions = function getAttributions() {
	const attributions: string[] = [];
	const imgSources = Array.isArray(this.imgSource) ? this.imgSource : [this.imgSource];
	imgSources.forEach((source) => {
		const attr = source.attribution;
		attr && attributions.push(attr);
	});
	if (this.demSource) {
		const attr = this.demSource.attribution;
		attr && attributions.push(attr);
	}
	return [...new Set(attributions)];
};
