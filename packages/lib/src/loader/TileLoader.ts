/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BufferGeometry, Event, Material, Mesh, MeshBasicMaterial, NormalBufferAttributes, PlaneGeometry } from "three";
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
		const materials = await this.loadMaterial(x, y, z, bounds);

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
		let geometry: BufferGeometry;
		if (
			this.demSource &&
			z >= this.demSource.minLevel &&
			this._isBoundsInSourceBounds(this.demSource, tileBounds)
		) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			loader.useWorker = this.useWorker;
			const source = this.demSource;
			geometry = await loader.load({ source, x, y, z, bounds: tileBounds }).catch((_err) => {
				console.error("Load material error", source.dataType, x, y, z);
				return new PlaneGeometry();
			});
			const dispose = (evt: { target: BufferGeometry<NormalBufferAttributes> }) => {
				loader.unload && loader.unload(evt.target);
				evt.target.removeEventListener("dispose", dispose);
			};
			geometry.addEventListener("dispose", () => {
				loader.unload && loader.unload(geometry);
			});
		} else {
			geometry = new PlaneGeometry();
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
	protected async loadMaterial(
		x: number,
		y: number,
		z: number,
		bounds: [number, number, number, number],
	): Promise<Material[]> {
		// get source in viewer
		const sources = this.imgSource.filter(
			(source) => z >= source.minLevel && this._isBoundsInSourceBounds(source, bounds),
		);
		if (sources.length === 0) {
			return [];
		}

		const materialsPromise = sources.map(async (source) => {
			const loader = LoaderFactory.getMaterialLoader(source);
			loader.useWorker = this.useWorker;
			const material = await loader.load({ source, x, y, z, bounds }).catch((_err) => {
				console.error("Load material error", source.dataType, x, y, z);
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
