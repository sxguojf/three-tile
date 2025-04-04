/**
 *@description: Wireframe material loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { Color, MeshBasicMaterial } from "three";
/**
 * Wireframe material loader
 */
export class TileMaterialWrieLoader {
    info = {
        version: "0.10.0",
        description: "Tile wireframe material loader.",
    };
    dataType = "wireframe";
    async load(params) {
        const color = new Color(`hsl(${params.z * 14}, 100%, 50%)`);
        const material = new MeshBasicMaterial({
            transparent: true,
            wireframe: true,
            color,
            opacity: params.source.opacity,
            depthTest: false,
        });
        return material;
    }
}
