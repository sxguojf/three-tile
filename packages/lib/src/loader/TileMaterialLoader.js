/**
 *@description: Image Material loader abstract base class
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { version } from "..";
import { TileMaterial } from "../material";
import { getSafeTileUrlAndBounds } from "./util";
/**
 * Image loader base calss
 */
export class TileMaterialLoader {
    constructor() {
        this.info = {
            version,
            description: "Image loader base class",
        };
        this.dataType = "";
        this._material = new TileMaterial();
    }
    /** 取得默认材质 */
    get material() {
        return this._material;
    }
    /** 设置默认材质 */
    set material(value) {
        this.material.dispose();
        this._material = value;
    }
    /**
     * Load tile material from source
     * @param source
     * @param tile
     * @returns
     */
    async load(params) {
        const { source, x, y, z } = params;
        const material = this.createMaterial(params);
        material.transparent = params.source.transparent;
        material.opacity = params.source.opacity;
        // get max level tile and bounds
        const { url, clipBounds } = getSafeTileUrlAndBounds(source, x, y, z);
        if (url) {
            material.map = await this.doLoad(url, { ...params, clipBounds });
            material.addEventListener("dispose", dispose);
        }
        return material;
    }
    /**
     * Create material
     * @returns {ITileMaterial} the material of tile
     */
    createMaterial(_params) {
        return this.material.clone();
    }
    /**
     * Download terrain data
     * @param url url
     * @returns {Promise<TBuffer>} the buffer of download data
     */
    async doLoad(_url, _params) {
        return Promise.resolve(undefined);
    }
}
const dispose = (evt) => {
    const texture = evt.target.map;
    if (texture) {
        if (texture.image instanceof ImageBitmap) {
            texture.image.close();
        }
        texture.dispose();
    }
    evt.target.removeEventListener("dispose", dispose);
};
