/**
 *@description: Tile marterila
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { FrontSide, MeshStandardMaterial } from "three";
/**
 * 瓦片材质
 */
export class TileMaterial extends MeshStandardMaterial {
    constructor(params = {}) {
        super({ ...{ transparent: false, side: FrontSide }, ...params });
    }
}
