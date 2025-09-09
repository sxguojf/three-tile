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
		this._downloadingThreads++;
		let mesh: TileMesh;
		// no tileMesh, create tile mesh
		if (!tileMesh) {
			mesh = await this._createTileMesh(params);
		} else {
			// has tileMesh, update tile mesh
			mesh = await this._updateTileMesh(params, tileMesh);
		}

		//set multiple material
		mesh.geometry.clearGroups();
		for (let i = 0; i < mesh.material.length; i++) {
			mesh.geometry.addGroup(0, Infinity, i);
		}

		this._downloadingThreads--;
		return mesh;
	}

	/**
	 * Create tile mesh
	 * @param params load params(x,y,z,bounds etc.)
	 * @returns Promise<TileMesh> tile mesh
	 */
	private async _createTileMesh(params: TileLoadParamsType) {
		const demSource = this.demSource;
		const imgSource = this.imgSource;
		const geometry = await this.loadGeometry(params);
		const material = await this.loadMaterial(params);
		const mesh: TileMesh = new Mesh(geometry, material);
		mesh.userData.demSource = demSource;
		mesh.userData.imgSource = imgSource;

		return mesh;
	}

	/**
	 * Update tile mesh
	 * @param params load params(x,y,z,bounds etc.)
	 * @param tileMesh tile mesh
	 * @returns Promise<TileMesh> tile mesh
	 */
	private async _updateTileMesh(params: TileLoadParamsType, tileMesh: TileMesh) {
		// source not change, return
		const imgchanged = tileMesh.userData.imgSource != this.imgSource;
		const demChanged = tileMesh.userData.demSource != this.demSource;
		if (!imgchanged && !demChanged) {
			return tileMesh;
		}

		// update dem
		if (demChanged) {
			let geometry = tileMesh.geometry;
			tileMesh.userData.demSource = this.demSource;
			tileMesh.geometry = await this.loadGeometry(params);
			geometry.dispose();
		}

		// update img
		if (imgchanged) {
			let material = tileMesh.material;
			tileMesh.userData.imgSource = this.imgSource;
			tileMesh.material = await this.loadMaterial(params);
			material.forEach(mat => mat.dispose());
		}

		return tileMesh;
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

	/**
	 * Load geometry
	 * @returns BufferGeometry
	 */
	protected async loadGeometry(params: TileLoadParamsType): Promise<BufferGeometry> {
		let geometry: BufferGeometry;
		const { bounds, z } = params;
		if (this.demSource && z >= this.demSource.minLevel && this._intersectsBounds(this.demSource, bounds)) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
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

			if (geometry != this._errorGeometry) {
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
	protected async loadMaterial(params: TileLoadParamsType): Promise<Material[]> {
		const materials: Material[] = [];
		const { bounds, z } = params;
		const sources = this.imgSource.filter(source => z >= source.minLevel && this._intersectsBounds(source, bounds));

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
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

			if (material !== this._errorMaterial) {
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
