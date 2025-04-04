import { TileSource } from "three-tile";
/**
 * Stadia data source
 */
export class StadiaSource extends TileSource {
    dataType = "image";
    attribution = "Stadia";
    url = "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
