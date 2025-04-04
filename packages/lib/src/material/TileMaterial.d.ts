/**
 *@description: Tile marterila
 *@author: 郭江峰
 *@date: 2023-04-05
 */
import { MeshStandardMaterial, MeshStandardMaterialParameters, Texture } from "three";
/**
 * Tile material
 */
export declare class TileMaterial extends MeshStandardMaterial {
    constructor(params?: MeshStandardMaterialParameters);
    setTexture(texture: Texture): void;
    dispose(): void;
}
