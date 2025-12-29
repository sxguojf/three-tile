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

	/** Map bounds in lonlat, default is world */
	private _bounds: BoundsType = [-180, -85, 180, 85];
	public get bounds(): BoundsType {
		return this._bounds;
	}
	public set bounds(value: BoundsType) {
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
	/** Get terrain source */
	public get demSource(): ISource | undefined {
		return this._demSource;
	}
	/** Set terrain source */
	public set demSource(value: ISource | undefined) {
		this._demSource = value;
	}

	/** Get map prjection ID */
	public get projectionID() {
		return this.imgSource[0].projectionID;
	}

	/** Loader manager */
	public get manager(): TileLoadingManager {
		return LoaderFactory.manager;
	}

	/** Debug single */
	public debug = 0;

	/** Error material */
	private readonly _errorMaterial = new MeshBasicMaterial({
		color: 0,
		transparent: true,
		opacity: 0.2,
		name: "error-material",
	});

	/**
	 * Load getmetry and materail of tile from x, y and z coordinate.
	 * @param params load params(x,y,z,bounds etc.)
	 * @param tileMesh tile mesh
	 * @returns Promise<TileMesh> tile mesh
	 */
	public async load(params: TileLoadParamsType): Promise<TileMesh> {
		const count = this.demSource ? 1 : 0 + this.imgSource.length;
		this._downloadingThreads += count;

		let mesh: TileMesh;
		try {
			// load
			const material = await this.loadMaterial(params);
			const geometry = await this.loadGeometry(params);

			// new mesh
			mesh = new Mesh(geometry, material);

			//set material array
			mesh.geometry.clearGroups();
			mesh.material.forEach((_, i) => {
				mesh.geometry.addGroup(0, Infinity, i);
			});
		} finally {
			this._downloadingThreads -= count;
		}

		return mesh;
	}

	/**
	 * modify tile
	 * @param params
	 * @param tileMesh
	 */
	public async update(params: TileLoadParamsType, tileMesh: TileMesh) {
		const count = this.demSource ? 1 : 0 + this.imgSource.length;
		this._downloadingThreads += count;

		try {
			// load
			const material = await this.loadMaterial(params, tileMesh.material);
			const geometry = await this.loadGeometry(params, tileMesh.geometry);

			//set material array
			geometry.clearGroups();
			material.forEach((_, i) => {
				geometry.addGroup(0, Infinity, i);
			});

			// dispose old geometry
			if (geometry != tileMesh.geometry) {
				tileMesh.geometry.dispose();
				delete tileMesh.geometry.userData.source;
			}

			// dispose old material
			tileMesh.material.forEach((mat, i) => {
				if (mat !== this._errorMaterial && mat != material[i]) {
					mat.dispose();
					delete mat.userData.source;
				}
			});

			tileMesh.geometry = geometry;
			tileMesh.material = material;

			console.assert(tileMesh.material.length === tileMesh.geometry.groups.length);
		} finally {
			this._downloadingThreads -= count;
		}
	}

	/**
	 * Load geometry
	 * @returns BufferGeometry
	 */
	protected async loadGeometry(params: TileLoadParamsType, tileGeometry?: BufferGeometry): Promise<BufferGeometry> {
		// no dem source or out of bounds
		if (!this.demSource || !this._checkBounds(this.demSource, params)) {
			return new TileGeometry();
		}

		// source not changed
		if (tileGeometry && tileGeometry.userData.source === this.demSource) {
			return tileGeometry;
		}

		// get loader
		const loader = LoaderFactory.getGeometryLoader(this.demSource);

		// load geometry
		const geometry = await loader
			.load({ source: this.demSource, ...params })
			.then(geo => {
				geo.userData.source = this.demSource;
				return geo;
			})
			.catch(e => {
				if (this.debug > 0) {
					console.error("Load Geometry Error:", e);
				}
				return new TileGeometry();
			});

		return geometry;
		// return new PlaneGeometry();
	}

	/**
	 * Load material
	 * @param x x coordinate of tile
	 * @param y y coordinate of tile
	 * @param z z coordinate of tile
	 * @returns Material[]
	 */
	protected async loadMaterial(params: TileLoadParamsType, tileMaterial?: Material[]): Promise<Material[]> {
		// result
		const materials: Material[] = [];

		// visible sources
		const sources = this.imgSource.filter(source => this._checkBounds(source, params));

		for (let i = 0; i < sources.length; i++) {
			const source = sources[i];
			// source not changed
			if (tileMaterial) {
				const oldMaterial = tileMaterial[i];
				if (oldMaterial && source === oldMaterial.userData.source) {
					materials.push(oldMaterial);
					continue;
				}
			}

			// load
			const loader = LoaderFactory.getMaterialLoader(source);
			const material: Material = await loader
				.load({ source, ...params })
				.then(mat => {
					mat.userData.source = source;
					return mat;
				})
				.catch(e => {
					if (this.debug > 0) {
						console.error("Load Material Error:", e.target.src);
					}
					return this._errorMaterial.clone();
				});

			// clip the materilal to map bounds
			this._materialClip(material, source, params);
			materials.push(material);
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

	/** Check the tile is in the source bounds. */
	private _checkBounds(source: ISource, params: TileLoadParamsType) {
		const intersectsBounds = (source: ISource, tileBounds: BoundsType): boolean => {
			const sourceBounds = source._projectionBounds;
			return (
				tileBounds[2] >= sourceBounds[0] &&
				tileBounds[3] >= sourceBounds[1] &&
				tileBounds[0] <= sourceBounds[2] &&
				tileBounds[1] <= sourceBounds[3]
			);
		};

		return params.z >= source.minLevel && intersectsBounds(source, params.bounds);
	}
}
