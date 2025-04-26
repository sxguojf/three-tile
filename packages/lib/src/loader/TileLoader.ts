/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry, Event, Material, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";
import { ISource } from "../source";
import { ITileLoader, MeshDateType, TileLoadParamsType } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";
import { TileGeometry } from "../geometry";
import { _debug, throwError } from "..";

/**
 * Tile loader
 */
export class TileLoader implements ITileLoader {
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

	/** Loader manager */
	public manager = LoaderFactory.manager;

	/**
	 * Load getmetry and materail of tile from x, y and z coordinate.
	 *
	 * @returns Promise<MeshDateType> tile data
	 */
	public async load(params: TileLoadParamsType): Promise<MeshDateType> {
		const geometry = await this.loadGeometry(params);
		const materials = await this.loadMaterial(params);

		console.assert(!!materials && !!geometry);

		for (let i = 0; i < materials.length; i++) {
			geometry.addGroup(0, Infinity, i);
		}

		return { materials, geometry };
	}

	/**
	 * Unload tile mesh data
	 * @param tileMesh tile mesh
	 */
	public unload(tileMesh: Mesh): void {
		const materials = tileMesh.material as Material[];
		const geometry = tileMesh.geometry as BufferGeometry;
		// console.log(materials, geometry);
		for (let i = 0; i < materials.length; i++) {
			materials[i].dispose();
		}
		geometry.dispose();
	}

	/**
	 * Load geometry
	 * @returns BufferGeometry
	 */
	protected async loadGeometry(params: TileLoadParamsType): Promise<BufferGeometry> {
		let geometry: BufferGeometry;
		if (
			this.demSource &&
			params.z >= this.demSource.minLevel &&
			this._isBoundsInSourceBounds(this.demSource, params.bounds)
		) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			const source = this.demSource;
			geometry = await loader.load({ source, ...params }).catch(err => {
				throwError(err);
				return new PlaneGeometry();
			});
			geometry.addEventListener("dispose", () => {
				loader.unload && loader.unload(geometry);
			});
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
		const sources = this.imgSource.filter(
			source => params.z >= source.minLevel && this._isBoundsInSourceBounds(source, params.bounds)
		);

		const materialsPromise = sources.map(async source => {
			const loader = LoaderFactory.getMaterialLoader(source);
			const material = await loader.load({ source, ...params }).catch(err => {
				throwError(err);
				return new MeshBasicMaterial();
			});
			const dispose = (evt: Event<"dispose", Material>) => {
				loader.unload && loader.unload(evt.target);
				evt.target.removeEventListener("dispose", dispose);
			};
			if (!(material instanceof MeshBasicMaterial)) {
				material.addEventListener("dispose", dispose);
			}
			return material;
		});
		return Promise.all(materialsPromise);
	}

	/**
	 * Check the tile is in the source bounds. (projection coordinate)
	 * @returns true in the bounds,else false
	 */
	private _isBoundsInSourceBounds(source: ISource, bounds: [number, number, number, number]): boolean {
		const sourceBounds = source._projectionBounds;
		const inBounds = !(
			bounds[2] < sourceBounds[0] ||
			bounds[3] < sourceBounds[1] ||
			bounds[0] > sourceBounds[2] ||
			bounds[1] > sourceBounds[3]
		); //[minx, miny, maxx, maxy]
		return inBounds;
	}
}
