import { FrontSide, MeshStandardMaterial, MeshStandardMaterialParameters, Texture } from "three";

/**
 * Tile material
 */
export class TileMaterial extends MeshStandardMaterial {
	constructor(params: MeshStandardMaterialParameters = {}) {
		super({ ...{ transparent: true, side: FrontSide }, ...params });
	}

	public setTexture(texture: Texture) {
		this.map = texture;
		this.needsUpdate = true;
	}

	public dispose(): void {
		const texture = this.map;
		if (texture) {
			if (texture.image instanceof ImageBitmap) {
				texture.image.close();
			}
			texture.dispose();
		}
	}
}
