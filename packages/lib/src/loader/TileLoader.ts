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
	/** Get the map bounds */
	public get bounds() {
		return this._bounds;
	}
	/** Set the map bounds */
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
		color: 0xff0000,
		transparent: true,
		opacity: 0,
		name: "error-material",
	});

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
			// load
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
				// new mesh
				mesh = new Mesh(geometry, material);
			}

			//set material array
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
	}

	/**
	 * Update material of tile mesh
	 * @param params
	 * @param tileMesh
	 */
	public update(params: TileLoadParamsType, tileMesh: TileMesh): void {
		// visible sources
		const sources = this.imgSource.filter(source => this._checkVisible(source, params));

		for (let i = 0; i < sources.length; i++) {
			if (sources[i].dynamic) {
				const loader = LoaderFactory.getMaterialLoader(sources[i]);
				tileMesh.material[i] && loader.update && loader.update(tileMesh.material[i]);
			}
		}
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

		if (this.demSource && this._checkVisible(this.demSource, params)) {
			// get loader
			const loader = LoaderFactory.getGeometryLoader(this.demSource);

			// load geometry
			const source = this.demSource;
			const geometry = await loader.load({ source, ...params }).catch(e => {
				if (this.debug > 0) {
					console.error("Load Geometry Error:", e);
				}
				return new TileGeometry();
			});

			// dispose
			geometry.userData.source = source;
			const dispose = (evt: { target: BufferGeometry }) => {
				loader.unload && loader.unload(evt.target);
				evt.target.removeEventListener("dispose", dispose);
			};
			geometry.addEventListener("dispose", dispose);

			return geometry;
		} else {
			return new TileGeometry();
		}
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

		// result
		const materials: Material[] = [];

		// visible sources
		const sources = this.imgSource.filter(source => this._checkVisible(source, params));

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
			const material: Material = await loader.load({ source, ...params }).catch(e => {
				if (this.debug > 0) {
					console.error("Load Material Error:", e);
				}
				return this._errorMaterial.clone();
			});

			// clip the materilal to map bounds
			this._materialClip(material, source, params);

			if (material.name != "error-material") {
				// set material property
				material.opacity = source.opacity;
				material.transparent = source.transparent;

				// dispose
				const dispose = (evt: { target: Material }) => {
					loader.unload && loader.unload(evt.target);
					evt.target.removeEventListener("dispose", dispose);
				};
				material.addEventListener("dispose", dispose);
			}

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
	private _checkVisible(source: ISource, params: TileLoadParamsType) {
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
