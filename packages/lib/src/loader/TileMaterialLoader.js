/**
 *@description: Image Material loader abstract base class
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { TileMaterial } from "../material";
import { LoaderFactory } from "./LoaderFactory";
import { getSafeTileUrlAndBounds } from "./util";
/**
 * Image loader base calss
 */
export class TileMaterialLoader {
    info = {
        version: "0.10.0",
        description: "Image loader base class",
    };
    dataType = "";
    useWorker = true;
    /**
     * Load tile data from source
     * @param source
     * @param tile
     * @returns
     */
    async load(params) {
        const { source, x, y, z } = params;
        const material = new TileMaterial();
        // get max level tile and bounds
        const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
        if (url) {
            const texture = await this.doLoad(url, { source, x, y, z, bounds: clipBounds });
            material.map = texture;
            LoaderFactory.manager.parseEnd(url);
        }
        return material;
    }
}
