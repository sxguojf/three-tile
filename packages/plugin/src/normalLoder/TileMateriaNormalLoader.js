/**
 *@description: Tile normal loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { MeshNormalMaterial } from "three";
/**
 * Tile normal Material loader
 */
export class TileMateriaNormalLoader {
    info = {
        version: "0.10.0",
        description: "Tile normal material loader.",
    };
    dataType = "normal";
    async load(params) {
        const material = new MeshNormalMaterial({
            // transparent: true,
            opacity: params.source.opacity,
            flatShading: true,
        });
        return material;
    }
}
