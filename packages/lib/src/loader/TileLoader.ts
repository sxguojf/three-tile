/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { BoxHelper, BufferGeometry, Material, Mesh, MeshBasicMaterial } from "three";
import { TileGeometry } from "../geometry";
import { ISource } from "../source";
import { ITileLoader, TileLoadParamsType } from "./ITileLoaders";
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

	/** Loader manager */
	public manager = LoaderFactory.manager;

	public debug = false;

	/**
	 * Load getmetry and materail of tile from x, y and z coordinate.
	 *
	 * @returns Promise<MeshDateType> tile data
	 */
	public async load(params: TileLoadParamsType): Promise<Mesh> {
		const geometry = await this.loadGeometry(params);
		const materials = await this.loadMaterial(params);
		console.assert(!!materials && !!geometry);
		for (let i = 0; i < materials.length; i++) {
			geometry.addGroup(0, Infinity, i);
		}

		const mesh = new Mesh(geometry, materials);
		if (this.debug && params.z > 7) {
			const box = new BoxHelper(mesh, 0xffff00);
			box.name = "boxHelper";
			mesh.add(box);
		}
		return mesh;
	}

	private async updateGeometry(tileMesh: Mesh, params: TileLoadParamsType) {
		const oldGeometry = tileMesh.geometry;
		tileMesh.geometry = await this.loadGeometry(params);
		tileMesh.geometry.groups = oldGeometry.groups;
		oldGeometry.dispose();
	}

	private async updateMaterial(tileMesh: Mesh, params: TileLoadParamsType) {
		const oldMaterial = Array.isArray(tileMesh.material) ? tileMesh.material : [tileMesh.material];
		const material = await this.loadMaterial(params);
		tileMesh.material = material;
		tileMesh.geometry.clearGroups();
		for (let i = 0; i < material.length; i++) {
			tileMesh.geometry.addGroup(0, Infinity, i);
		}
		for (let i = 0; i < oldMaterial.length; i++) {
			oldMaterial[i].dispose();
		}
	}

	/**
	 * Update tile mesh data
	 * @param tileMesh tile mesh
	 */
	public async update(tileMesh: Mesh, params: TileLoadParamsType, updateMaterial: boolean, updateGeometry: boolean) {
		if (updateGeometry) {
			await this.updateGeometry(tileMesh, params);
		}
		if (updateMaterial) {
			await this.updateMaterial(tileMesh, params);
		}
	}

	/**
	 * Unload tile mesh data
	 * @param tileMesh tile mesh
	 */
	public unload(tileMesh: Mesh): void {
		const materials = Array.isArray(tileMesh.material) ? tileMesh.material : [tileMesh.material];
		for (let i = 0; i < materials.length; i++) {
			materials[i].dispose();
			tileMesh.geometry.groups.pop();
		}
		tileMesh.geometry.dispose();
		const box = tileMesh.getObjectByName("boxHelper");
		if (box instanceof BoxHelper) {
			box.dispose();
		}
	}

	/**
	 * Load geometry
	 * @returns BufferGeometry
	 */
	protected async loadGeometry(params: TileLoadParamsType): Promise<BufferGeometry> {
		let geometry: BufferGeometry;
		const { bounds, z } = params;
		if (this.demSource && z >= this.demSource.minLevel && this._isBoundsInSourceBounds(this.demSource, bounds)) {
			const loader = LoaderFactory.getGeometryLoader(this.demSource);
			const source = this.demSource;
			geometry = await loader.load({ source, ...params }).catch(e => {
				if (this.debug) {
					console.error("Load Geometry Error:", e);
				}
				return new TileGeometry();
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
		const { bounds, z } = params;
		const sources = this.imgSource.filter(
			source => z >= source.minLevel && this._isBoundsInSourceBounds(source, bounds)
		);

		const materialsPromise = sources.map(async source => {
			const loader = LoaderFactory.getMaterialLoader(source);
			const material: Material = await loader.load({ source, ...params }).catch(e => {
				if (this.debug) {
					console.error("Load Material Error:", e);
				}
				return new MeshBasicMaterial({ transparent: true, opacity: 0.2, color: "#555" });
			});
			material.opacity = source.opacity;
			const dispose = (evt: { target: Material }) => {
				loader.unload && loader.unload(evt.target);
				evt.target.removeEventListener("dispose", dispose);
			};
			material.addEventListener("dispose", dispose);
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
