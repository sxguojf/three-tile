/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry, Material, Mesh, MeshBasicMaterial, Texture } from "three";
import { TileGeometry } from "../geometry";
import { ISource } from "../source";
import { BoundsType, ITileLoader, TileLoadParamsType, TileMesh } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";
import { TileLoadingManager } from "./TileLoadingManager";
import { tileBoundsClip } from "./util";

/**
 * Tile loader
 */
export class TileLoader implements ITileLoader {
	private _downloadingThreads = 0;

	private _bounds: BoundsType = [-180, -85, 180, 85];
	public get bounds() {
		return this._bounds;
	}
	public set bounds(value) {
		this._bounds = value;
	}

	private _maxThreads = 10;
	/** Get the max downloading threads count*/
	public get maxThreads() {
		return this._maxThreads;
	}
	/** Set the max downloading threads count*/
	public set maxThreads(value) {
		this._maxThreads = value;
	}

	/** Get downloading threads count*/
	public get downloadingThreads(): number {
		return this._downloadingThreads;
	}

	private _imgSource: ISource[] = [];
	/** Get image source */
	public get imgSource(): ISource[] {
		return this._imgSource;
	}
	/** Set image source */
	public set imgSource(value: ISource[]) {
		this._imgSource = value;
	}

	private _demSource: ISource | undefined;
	/** Get DEM source */
	public get demSource(): ISource | undefined {
		return this._demSource;
	}
	/** Set DEM source */
	public set demSource(value: ISource | undefined) {
		this._demSource = value;
	}

	public get projectionID() {
		return this.imgSource[0].projectionID;
	}

	/** Error material */
	private readonly _errorMaterial = new MeshBasicMaterial({
		color: 0xff0000,
		transparent: true,
		opacity: 0,
		name: "error-material",
	});

	/** Error geometry */
	private readonly _errorGeometry = new TileGeometry();

	/** Loader manager */
	public get manager(): TileLoadingManager {
		return LoaderFactory.manager;
	}

	/** Debug single */
	public debug = 0;

	/**
	 * Load getmetry and materail of tile from x, y and z coordinate.
	 * @param params load params(x,y,z,bounds etc.)
	 * @param tileMesh tile mesh
	 * @returns Promise<TileMesh> tile mesh
	 */
	public async load(params: TileLoadParamsType, tileMesh?: TileMesh): Promise<TileMesh> {
		const count = this.demSource ? 1 : 0 + this.imgSource.length;
		this._downloadingThreads += count;

		let mesh: TileMesh;
		try {
			const geometry = await this.loadGeometry(params, tileMesh?.geometry);
			const material = await this.loadMaterial(params, tileMesh?.material);

			if (tileMesh) {
				const oldGeometry = tileMesh.geometry;
				const oldMaterial = tileMesh.material;
				mesh = tileMesh;
				mesh.geometry = geometry;
				mesh.material = material;

				// dispose old geometry
				if (oldGeometry.userData.toDispose) {
					oldGeometry.dispose();
					delete oldGeometry.userData.source;
					delete oldGeometry.userData.toDispose;
				}
				// dispose old material
				oldMaterial.forEach(mat => {
					if (mat.userData.toDispose) {
						mat.dispose();
						delete mat.userData.source;
						delete mat.userData.toDispose;
					}
				});
			} else {
				mesh = new Mesh(geometry, material);
			}

			//set multiple material
			mesh.geometry.clearGroups();
			for (let i = 0; i < mesh.material.length; i++) {
				mesh.geometry.addGroup(0, Infinity, i);
			}
		} finally {
			this._downloadingThreads -= count;
		}

		return mesh;
	}

	/**
	 * Load geometry
	 * @returns BufferGeometry
	 */
	protected async loadGeometry(params: TileLoadParamsType, tileGeometry?: BufferGeometry): Promise<BufferGeometry> {
		if (tileGeometry) {
			// source not changed
			if (this.demSource === tileGeometry.userData.source) {
				tileGeometry.userData.toDispose = false;
				return tileGeometry;
			} else {
				tileGeometry.userData.toDispose = true;
			}
		}

		const { bounds, z } = params;
		let geometry: BufferGeometry;

		if (this.demSource && z >= this.demSource.minLevel && this._intersectsBounds(this.demSource, bounds)) {
			// get loader
			const loader = LoaderFactory.getGeometryLoader(this.demSource);

			// load geometry
			const source = this.demSource;
			geometry = await loader
				.load({ source, ...params })
				.catch(e => {
					if (this.debug > 0) {
						console.error("Load Geometry Error:", e);
					}
					return this._errorGeometry;
				})
				.finally(() => {});

			// dispose
			if (geometry != this._errorGeometry) {
				geometry.userData.source = source;
				const dispose = (evt: { target: BufferGeometry }) => {
					loader.unload && loader.unload(evt.target);
					evt.target.removeEventListener("dispose", dispose);
				};
				geometry.addEventListener("dispose", dispose);
			}
		} else {
			geometry = new TileGeometry();
		}

		return geometry;
	}

	/**
	 * Load material
	 * @param x x coordinate of tile
	 * @param y y coordinate of tile
	 * @param z z coordinate of tile
	 * @returns Material[]
	 */
	protected async loadMaterial(params: TileLoadParamsType, tileMaterial?: Material[]): Promise<Material[]> {
		// set old material to dispose
		if (tileMaterial) {
			tileMaterial.forEach(mat => (mat.userData.toDispose = true));
		}

		const materials: Material[] = [];
		const { bounds, z } = params;
		const sources = this.imgSource.filter(source => z >= source.minLevel && this._intersectsBounds(source, bounds));

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];

			// no change
			if (tileMaterial) {
				const oldMaterial = tileMaterial[i];
				if (oldMaterial && source === oldMaterial.userData.source) {
					oldMaterial.userData.toDispose = false;
					materials.push(oldMaterial);
					continue;
				}
			}

			// load
			const loader = LoaderFactory.getMaterialLoader(source);
			const material: Material = await loader
				.load({ source, ...params })
				.catch(e => {
					if (this.debug > 0) {
						console.error("Load Material Error:", e);
					}
					return this._errorMaterial;
				})
				.finally(() => {});

			// set material property and dispose
			if (material !== this._errorMaterial) {
				material.userData.source = source;
				this._materialClip(material, source, params);
				material.opacity = source.opacity;
				material.transparent = source.transparent;
				const dispose = (evt: { target: Material }) => {
					loader.unload && loader.unload(evt.target);
					evt.target.removeEventListener("dispose", dispose);
				};
				material.addEventListener("dispose", dispose);
				materials.push(material);
			}
		}
		return materials;
	}

	/**
	 * Unload tile mesh data
	 * @param tileMesh tile mesh
	 */
	public unload(tileMesh: TileMesh): void {
		const materials = tileMesh.material;
		for (let i = 0; i < materials.length; i++) {
			materials[i].dispose();
			tileMesh.geometry.groups.pop();
		}
		tileMesh.geometry.dispose();
		tileMesh.material = [];

		delete tileMesh.userData.demSource;
		delete tileMesh.userData.imgSource;
	}

	/** Clip the material texture from mapBounds */
	private _materialClip(material: Material, source: ISource, params: TileLoadParamsType) {
		if ("map" in material && material.map instanceof Texture) {
			const texture = material.map;
			if (texture.image) {
				texture.image = tileBoundsClip(texture.image, source._projectionBounds, params.bounds);
			}
			texture.needsUpdate = true;
		}
		return this;
	}

	/**
	 * Check the tile is in the source bounds. (projection coordinate)
	 * @returns true in the bounds,else false
	 */
	private _intersectsBounds(source: ISource, tileBounds: BoundsType): boolean {
		const mapBounds = source._projectionBounds;
		return (
			tileBounds[2] >= mapBounds[0] &&
			tileBounds[3] >= mapBounds[1] &&
			tileBounds[0] <= mapBounds[2] &&
			tileBounds[1] <= mapBounds[3]
		);
	}
}
