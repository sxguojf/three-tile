/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry, Material, PlaneGeometry } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";
import { CacheEx } from "./CacheEx";
import { ITileLoader } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";

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
	 * Load a tile by x, y and z coordinate.
	 *
	 * @param x x coordinate of tile
	 * @param y y coordinate of tile
	 * @param z z coordinate of tile
	 * @param onLoad tile loaded callback
	 * @returns tile instance
	 */
	public load(x: number, y: number, z: number, onLoad: () => void): Tile {
		const tile = new Tile(x, y, z);
		const abortController = new AbortController();

		const onDispose = () => {
			if (!tile.loaded) {
				abortController.abort();
			}
		};
		tile.addEventListener("dispose", () => {
			onDispose();
			tile.removeEventListener("dispose", onDispose);
		});

		this.doLoad(tile, onLoad, abortController.signal);

		return tile;
	}

	/**
	 * Load Geometry and meterial
	 */
	protected doLoad(tile: Tile, onLoad: () => void, abortSignal: AbortSignal): void {
		const loadGeometry = () => {
			const materials = this.loadMaterial(tile.x, tile.y, tile.z, () => loadMaterial(), abortSignal);
			const loadMaterial = () => {
				for (let i = 0; i < materials.length; i++) {
					geometry.addGroup(0, Infinity, i);
				}
				tile.geometry = geometry;
				tile.material = materials;
				onLoad();
			};
		};

		const geometry = this.loadGeometry(tile.x, tile.y, tile.z, loadGeometry, abortSignal);
	}

	/**
	 * Load geometry
	 * @param tile tile to load
	 * @param onLoad loaded callback
	 * @param onError error callback
	 * @returns geometry
	 */

	protected loadGeometry(
		x: number,
		y: number,
		z: number,
		onLoad: () => void,
		abortSignal: AbortSignal,
	): BufferGeometry {
		let geometry: BufferGeometry;
		// Load data in viewer, else create a PlaneGeometry
		if (this.demSource && z >= this.demSource.minLevel && this._tileInBounds(x, y, z, this.demSource)) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			loader.useWorker = this.useWorker;
			geometry = loader.load(this.demSource, x, y, z, onLoad, abortSignal);
		} else {
			geometry = new PlaneGeometry();
			onLoad();
		}
		return geometry;
	}

	/**
	 * Load material
	 * @param tile tile to load
	 * @param onLoad loaded callback
	 * @param onError error callback
	 * @returns material
	 */
	protected loadMaterial(x: number, y: number, z: number, onLoad: () => void, abortSignal: AbortSignal): Material[] {
		// get source in viewer
		const sources = this.imgSource.filter((source) => z >= source.minLevel && this._tileInBounds(x, y, z, source));
		if (sources.length === 0) {
			onLoad();
			return [];
		}
		let count = 0;
		const materials = sources.map((source) => {
			const loader = LoaderFactory.getMaterialLoader(source);
			loader.useWorker = this.useWorker;
			const material = loader.load(
				source,
				x,
				y,
				z,
				() => {
					count++;
					if (count >= sources.length) {
						onLoad();
					}
				},
				abortSignal,
			);
			return material;
		});
		return materials;
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
