/**
 *@description: TileLoader
 *@author: Guojf
 *@date: 2023-04-06
 */

import { BufferGeometry, LoadingManager, Material, PlaneGeometry, Vector3 } from "three";
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
					// this._checkVisible(tile);
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

	public loadChildren(px: number, py: number, pz: number, minLevel: number, onLoad: (tile: Tile) => void): Tile[] {
		const onOneLoad = (tile: Tile) => {
			this._checkVisible(tile);
			tile.onLoaded();
			onLoad(tile);
		};

		const getTile = (x: number, y: number, level: number, minLevle: number, onLoad: (tile: Tile) => void) => {
			const tile = level < minLevle ? new Tile(x, y, level) : this.load(x, y, level, () => onLoad(tile));
			return tile;
		};

		const children = [];

		const level = pz + 1;
		const x = px * 2;
		const z = 0;
		const pos = 0.25;
		// Tow children at level 0 when GWS projection
		const isWGS = this.imgSource[0].projectionID === "4326"; //ProjectionType.WGS84;
		if (pz === 0 && isWGS) {
			const y = py;
			const scale = new Vector3(0.5, 1.0, 1.0);
			const t1 = getTile(x, y, level, minLevel, () => onOneLoad(t1));
			const t2 = getTile(x, y, level, minLevel, () => onOneLoad(t2));
			t1.position.set(-pos, 0, z);
			t1.scale.copy(scale);
			t2.position.set(pos, 0, z);
			t2.scale.copy(scale);
			children.push(t1, t2);
		} else {
			const y = py * 2;
			const scale = new Vector3(0.5, 0.5, 1.0);
			const t1 = getTile(x, y + 1, level, minLevel, () => onOneLoad(t1));
			const t2 = getTile(x + 1, y + 1, level, minLevel, () => onOneLoad(t2));
			const t3 = getTile(x, y, level, minLevel, () => onOneLoad(t3));
			const t4 = getTile(x + 1, y, level, minLevel, () => onOneLoad(t4));
			t1.position.set(-pos, -pos, z);
			t1.scale.copy(scale);
			t2.position.set(pos, -pos, z);
			t2.scale.copy(scale);
			t3.position.set(-pos, pos, z);
			t3.scale.copy(scale);
			t4.position.set(pos, pos, z);
			t4.scale.copy(scale);
			children.push(t1, t2, t3, t4);
		}
		return children;
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
