/**
 *@description: TileLoader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferGeometry, Loader, Material, PlaneGeometry } from "three";
import { ISource, BaseSource } from "../source";
import { Tile } from "../tile";
import { ITileLoader } from "./ITileLoaders";
import { LoaderFactory } from "./LoaderFactory";
import { CacheEx } from "./CacheEx";

/**
 * tile loader
 */
export class TileLoader extends Loader implements ITileLoader {
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

	/**
	 * constructor
	 */
	constructor() {
		super(LoaderFactory.manager);
		// this.imgSource = imgSource || [BaseSource.create({ dataType: "test" })];
		// this.demSource = demSource;
	}

	/**
	 * load material and geometry data
	 * @param tile tile to load
	 * @param onLoad callback on data loaded
	 * @returns geometry, material(s)
	 */
	public load(tile: Tile, onLoad: () => void, onError: (err: any) => void) {
		if (this.imgSource.length === 0) {
			throw new Error("imgSource can not be empty");
		}

		const onDataLoad = () => {
			// dem and img both loaded
			if (geoLoaded && matLoaded) {
				for (let i = 0; i < materials.length; i++) {
					geometry.addGroup(0, Infinity, i);
				}
				onLoad();
			}
		};

		let geoLoaded = false;
		let matLoaded = false;

		const geometry = this.loadGeometry(
			tile,
			() => {
				geoLoaded = true;
				onDataLoad();
			},
			onError,
		);

		const materials = this.loadMaterial(
			tile,
			() => {
				matLoaded = true;
				onDataLoad();
			},
			onError,
		);

		tile.geometry = geometry;
		tile.material = materials;

		return { geometry, material: materials };
	}

	/**
	 * load geometry
	 * @param tile tile to load
	 * @param onLoad loaded callback
	 * @param onError error callback
	 * @returns geometry
	 */
	protected loadGeometry(tile: Tile, onLoad: () => void, onError: (err: any) => void): BufferGeometry {
		let geometry: BufferGeometry;
		// load dem if has dem source, else create a PlaneGeometry
		if (this.demSource) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			geometry = loader.load(this.demSource, tile, onLoad, onError);
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
	protected loadMaterial(tile: Tile, onLoad: () => void, onError: (err: any) => void): Material[] {
		const materials = this.imgSource.map((source) => {
			const loader = LoaderFactory.getMaterialLoader(source);
			const material = loader.load(
				source,
				tile,
				() => {
					material.userData.loaded = true;
					if (materials.every((mat) => mat.userData.loaded)) {
						onLoad();
					}
				},
				onError,
			);
			return material;
		});

		return materials;
	}
}
