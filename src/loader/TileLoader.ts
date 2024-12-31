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
 * tile loader
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
	 * load material and geometry data
	 * @param tile tile to load
	 * @param onLoad callback on data loaded
	 * @returns geometry, material(s)
	 */
	// public load(tile: Tile, onLoad: () => void) {
	// 	if (this.imgSource.length === 0) {
	// 		throw new Error("imgSource can not be empty");
	// 	}

	// 	const onDataLoad = () => {
	// 		// dem and img both loaded
	// 		if (geoLoaded && matLoaded) {
	// 			for (let i = 0; i < materials.length; i++) {
	// 				geometry.addGroup(0, Infinity, i);
	// 			}
	// 			onLoad();
	// 		}
	// 	};

	// 	let geoLoaded = false;
	// 	let matLoaded = false;

	// 	const geometry = this.loadGeometry(tile, () => {
	// 		geoLoaded = true;
	// 		onDataLoad();
	// 	});

	// 	const materials = this.loadMaterial(tile, () => {
	// 		matLoaded = true;
	// 		onDataLoad();
	// 	});

	// 	tile.geometry = geometry;
	// 	tile.material = materials;
	// }

	public load(x: number, y: number, z: number, onLoad: () => void): Tile {
		const tile = new Tile(x, y, z);
		const abortController = new AbortController();
		tile.addEventListener("dispose", () => {
			if (tile.loaded) {
				tile.material.forEach((mat) => mat.dispose());
				tile.material = [];
				tile.geometry.groups = [];
				tile.geometry.dispose();
			} else {
				abortController.abort();
			}
		});
		tile.addEventListener("show", (evt) => {
			tile.material.forEach((mat) => (mat.visible = evt.show));
		});

		setTimeout(() => this._load(tile, onLoad, abortController.signal));

		return tile;
	}

	// private _getUrl(tile: Tile, source: ISource) {
	// 	return getSafeTileUrlAndBounds(source, tile);
	// }

	private _load(tile: Tile, onLoad: () => void, abortSignal: AbortSignal) {
		if (tile.parent) {
			const onDataLoad = () => {
				// dem and img both loaded
				if (geoLoaded && matLoaded) {
					for (let i = 0; i < materials.length; i++) {
						geometry.addGroup(0, Infinity, i);
					}
					tile.geometry = geometry;
					tile.material = materials;
					this._checkVisible(tile);
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
				abortSignal,
			);

			const materials = this.loadMaterial(
				tile,
				() => {
					matLoaded = true;
					onDataLoad();
				},
				abortSignal,
			);
		}
	}

	private _checkVisible(tile: Tile) {
		const parent = tile.parent;
		if (parent && parent.isTile) {
			//Show children and hide parent when all children has loaded
			const children = parent.children.filter((child) => child.isTile);
			const loaded = children.every((child) => child.loaded);
			parent.showing = !loaded;
			children.forEach((child) => (child.showing = loaded));
		}
	}

	/**
	 * load geometry
	 * @param tile tile to load
	 * @param onLoad loaded callback
	 * @param onError error callback
	 * @returns geometry
	 */

	protected loadGeometry(tile: Tile, onLoad: () => void, abortSignal: AbortSignal): BufferGeometry {
		let geometry: BufferGeometry;
		// load dem if has dem source, else create a PlaneGeometry
		if (this.demSource) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			geometry = loader.load(this.demSource, tile, onLoad, abortSignal);
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
	protected loadMaterial(tile: Tile, onLoad: () => void, abortSignal: AbortSignal): Material[] {
		const materials = this.imgSource.map((source) => {
			const loader = LoaderFactory.getMaterialLoader(source);
			const material = loader.load(
				source,
				tile,
				() => {
					material.userData.loaded = true;
					// check all of materials loaded
					if (materials.every((mat) => mat.userData.loaded)) {
						onLoad();
					}
				},
				abortSignal,
			);
			return material;
		});

		return materials;
	}
}
