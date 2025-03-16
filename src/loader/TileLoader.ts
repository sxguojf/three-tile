/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry, Material, PlaneGeometry } from "three";
import { ISource } from "../source";
import { ITileLoader, MeshDateType, TileLoadParamsType } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";

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

	private _useWorker = true;
	/** Get use worker */
	public get useWorker() {
		return this._useWorker;
	}
	/** Set use worker */
	public set useWorker(value: boolean) {
		this._useWorker = value;
	}

	/** Loader manager */
	public manager = LoaderFactory.manager;

	/**
	 * Load getmetry and materail of tile from x, y and z coordinate.
	 *
	 * @param x x coordinate of tile
	 * @param y y coordinate of tile
	 * @param z z coordinate of tile
	 * @returns Promise<MeshDateType> tile data
	 */
	public async load(params: TileLoadParamsType): Promise<MeshDateType> {
		const { x, y, z, bounds } = params;
		const geometry = await this.loadGeometry(x, y, z, bounds);
		// .catch((_err) => {
		// 	console.log(`Tile terrain load error: (${x},${y},${z})`);
		// 	return new PlaneGeometry();
		// });
		const materials = await this.loadMaterial(x, y, z, bounds);
		// .catch((_err) => {
		// 	console.log(`Tile Image load error: (${x},${y},${z})`);
		// 	return [];
		// });

		console.assert(materials && geometry);

		for (let i = 0; i < materials.length; i++) {
			geometry.addGroup(0, Infinity, i);
		}

		return { materials, geometry };
	}

	/**
	 * Load geometry
	 * @param x x coordinate of tile
	 * @param y y coordinate of tile
	 * @param z z coordinate of tile
	 * @returns BufferGeometry
	 */
	protected async loadGeometry(
		x: number,
		y: number,
		z: number,
		tileBounds: [number, number, number, number],
	): Promise<BufferGeometry> {
		if (this.demSource && z >= this.demSource.minLevel && this._isBoundsInSource(this.demSource, tileBounds)) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			loader.useWorker = this.useWorker;
			return await loader.load({ source: this.demSource, x, y, z, bounds: tileBounds });
		} else {
			return new PlaneGeometry();
		}
	}

	/**
	 * Load material
	 * @param x x coordinate of tile
	 * @param y y coordinate of tile
	 * @param z z coordinate of tile
	 * @returns Material[]
	 */
	protected async loadMaterial(
		x: number,
		y: number,
		z: number,
		bounds: [number, number, number, number],
	): Promise<Material[]> {
		// get source in viewer
		const sources = this.imgSource.filter(
			(source) => z >= source.minLevel && this._isBoundsInSource(source, bounds),
		);
		if (sources.length === 0) {
			return [];
		}

		const materials = sources.map(async (source) => {
			const loader = LoaderFactory.getMaterialLoader(source);
			loader.useWorker = this.useWorker;

			return await loader.load({ source, x, y, z, bounds });
		});
		return Promise.all(materials);
	}

	/**
	 * Check the tile is in the source bounds
	 * @returns true in the bounds,else false
	 */
	private _isBoundsInSource(source: ISource, bounds: [number, number, number, number]): boolean {
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
