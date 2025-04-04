/**
 *@description: Tile marterila
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { FrontSide, MeshStandardMaterial } from "three";
/**
 * Tile material
 */
export class TileMaterial extends MeshStandardMaterial {
    constructor(params = {}) {
        // super({ ...{ transparent: true, side: FrontSide, roughness: 0.3, metalness: 0.8 }, ...params });
        super({ ...{ transparent: true, side: FrontSide }, ...params });
    }
    setTexture(texture) {
        this.map = texture;
        this.needsUpdate = true;
    }
    dispose() {
        const texture = this.map;
        if (texture) {
            if (texture.image instanceof ImageBitmap) {
                texture.image.close();
            }
            texture.dispose();
        }
    }
}
