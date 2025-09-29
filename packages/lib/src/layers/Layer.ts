import { ImageLoader, Material, SRGBColorSpace, Texture } from "three";
import { LoaderFactory, tileBoundsClip, TileLoadParamsType } from "../loader";
import { TileMap } from "../map";
import { TileMaterial } from "../material";
import { ISource } from "../source";

export class Layer {
	private loader = new ImageLoader(LoaderFactory.manager);
	public source: ISource;
	public map: TileMap;
	private _cache = new Map<string, Material>();

	public constructor(map: TileMap, source: ISource) {
		this.map = map;
		this.source = source;
	}
	public async load(params: TileLoadParamsType): Promise<TileMaterial | null> {
		const { x, y, z, bounds /*lonLatBounds*/ } = params;

		const url = this.source.getUrl(x, y, z);
		if (url) {
			// load
			let img: HTMLImageElement | OffscreenCanvas = await this.loader.loadAsync(url);

			// clip
			img = tileBoundsClip(img, this.source._projectionBounds, bounds);

			// texture
			const texture = new Texture(img);
			texture.colorSpace = SRGBColorSpace;
			texture.needsUpdate = true;

			// material
			const material = new TileMaterial({
				map: texture,
				transparent: true,
			});

			// cache
			this._cache.set(material.uuid, material);
			material.addEventListener("dispose", () => {
				this._cache.delete(material.uuid);
				material.map?.dispose();
			});

			return material;
		} else {
			return null;
		}
	}
}
