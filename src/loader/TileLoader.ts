/**
 *@description: TileLoader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferGeometry, LoadingManager, Material, PlaneGeometry } from "three";
import { ISource } from "../source";
import { Tile } from "../tile";
import { CacheEx } from "./CacheEx";
import { ITileLoader } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";

/**
 * Tile loader
 */
export class TileLoader implements ITileLoader {
	/** get loader cache size of file  */
	public get cacheSize() {
		return CacheEx.size;
	}
	/** set loader cache size of file  */
	public set cacheSize(value) {
		CacheEx.size = value;
	}

	private _imgSource: ISource[] = [];
	/** get image source */
	public get imgSource(): ISource[] {
		return this._imgSource;
	}
	/** set image source */
	public set imgSource(value: ISource[]) {
		this._imgSource = value;
	}

	private _demSource: ISource | undefined;
	/** get dem source */
	public get demSource(): ISource | undefined {
		return this._demSource;
	}
	/** set dem source */
	public set demSource(value: ISource | undefined) {
		this._demSource = value;
	}

	public manager: LoadingManager = LoaderFactory.manager;

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

		this._load(tile, onLoad, abortController.signal);

		return tile;
	}

	protected _load(tile: Tile, onLoad: () => void, abortSignal: AbortSignal) {
		const onDataLoad = () => {
			// dem and img both loaded
			if (geoLoaded && matLoaded) {
				for (let i = 0; i < materials.length; i++) {
					geometry.addGroup(0, Infinity, i);
				}
				tile.geometry = geometry;
				tile.material = materials;
				onLoad();
			}
		};

		let geoLoaded = false;
		let matLoaded = false;

		const geometry = this.loadGeometry(
			tile.x,
			tile.y,
			tile.z,
			() => {
				geoLoaded = true;
				onDataLoad();
			},
			abortSignal,
		);

		const materials = this.loadMaterial(
			tile.x,
			tile.y,
			tile.z,
			() => {
				matLoaded = true;
				onDataLoad();
			},
			abortSignal,
		);
	}

	/**
	 * load geometry
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
		// load dem if has dem source, else create a PlaneGeometry
		if (this.demSource && z >= this.demSource.minLevel && this._tileInBounds(x, y, z, this.demSource)) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			geometry = loader.load(this.demSource, x, y, z, onLoad, abortSignal);
		} else {
			geometry = new PlaneGeometry();
			setTimeout(onLoad);
		}
		return geometry;
	}

	/**
	 * load material
	 * @param tile tile to load
	 * @param onLoad loaded callback
	 * @param onError error callback
	 * @returns material
	 */
	protected loadMaterial(x: number, y: number, z: number, onLoad: () => void, abortSignal: AbortSignal): Material[] {
		const sources = this.imgSource.filter((source) => z >= source.minLevel && this._tileInBounds(x, y, z, source));
		if (sources.length === 0) {
			setTimeout(onLoad);
			return [];
		}
		let count = 0;
		const materials = sources.map((source) => {
			const loader = LoaderFactory.getMaterialLoader(source);
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
	 * 判断指定瓦片是否在边界内
	 *
	 * @param x 瓦片的 x 坐标
	 * @param y 瓦片的 y 坐标
	 * @param z 瓦片的层级
	 * @returns 如果瓦片在边界内则返回 true，否则返回 false
	 */
	private _tileInBounds(x: number, y: number, z: number, source: ISource): boolean {
		const bounds = source._projectionBounds;
		// 取得当前瓦片的bounds
		const tileBounds = source._getTileBounds(x, y, z);

		return !(
			tileBounds[2] < bounds[0] || // minx
			tileBounds[3] < bounds[1] || // miny
			tileBounds[0] > bounds[2] || // maxx
			tileBounds[1] > bounds[3]
		);
	}
}
