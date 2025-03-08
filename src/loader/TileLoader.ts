/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry, Material, PlaneGeometry } from "three";
import { ISource } from "../source";
import { ITileLoader, MeshDateType } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";
import { CacheEx } from "./CacheEx";

/**
 * Tile loader
 */
export class TileLoader implements ITileLoader {
	/** Get loader cache size of file  */
	public get cacheSize() {
		return CacheEx.size;
	}
	/** Set loader cache size of file  */
	public set cacheSize(value) {
		CacheEx.size = value;
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
	public async load(x: number, y: number, z: number): Promise<MeshDateType> {
		const geometry = await this.loadGeometry(x, y, z).catch((_err) => {
			console.warn(`Tile terrain load error: (${x},${y},${z}) !`);
			return new PlaneGeometry();
		});
		const materials = await this.loadMaterial(x, y, z).catch((_err) => {
			console.warn(`Tile Image load error: (${x},${y},${z}) !`);
			return [];
		});

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
	protected async loadGeometry(x: number, y: number, z: number): Promise<BufferGeometry> {
		if (this.demSource && z >= this.demSource.minLevel && this._tileInBounds(x, y, z, this.demSource)) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			loader.useWorker = this.useWorker;
			return await loader.load(this.demSource, x, y, z);
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
	protected async loadMaterial(x: number, y: number, z: number): Promise<Material[]> {
		// get source in viewer
		const sources = this.imgSource.filter((source) => z >= source.minLevel && this._tileInBounds(x, y, z, source));
		if (sources.length === 0) {
			return [];
		}

		const materials = sources.map(async (source) => {
			const loader = LoaderFactory.getMaterialLoader(source);
			loader.useWorker = this.useWorker;
			return await loader.load(source, x, y, z);
		});
		return Promise.all(materials);
	}

	/**
	 * Check the tile is in the bounds
	 *
	 * @param x x coordinate
	 * @param y y coordinate
	 * @param z z coordinate
	 * @returns true in the bounds,else false
	 */
	private _tileInBounds(x: number, y: number, z: number, source: ISource): boolean {
		const bounds = source._projectionBounds;
		// Get the bounds from tile xyz
		const tileBounds = source._getTileBounds(x, y, z);

		const inBounds = !(
			tileBounds[2] < bounds[0] || // minx
			tileBounds[3] < bounds[1] || // miny
			tileBounds[0] > bounds[2] || // maxx
			tileBounds[1] > bounds[3]
		);
		return inBounds;
	}
}
