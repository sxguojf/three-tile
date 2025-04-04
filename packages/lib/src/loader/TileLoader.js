/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { MeshBasicMaterial, PlaneGeometry } from "three";
import { LoaderFactory } from "./LoaderFactory";
/**
 * Tile loader
 */
export class TileLoader {
    _imgSource = [];
    /** Get image source */
    get imgSource() {
        return this._imgSource;
    }
    /** Set image source */
    set imgSource(value) {
        this._imgSource = value;
    }
    _demSource;
    /** Get DEM source */
    get demSource() {
        return this._demSource;
    }
    /** Set DEM source */
    set demSource(value) {
        this._demSource = value;
    }
    _useWorker = true;
    /** Get use worker */
    get useWorker() {
        return this._useWorker;
    }
    /** Set use worker */
    set useWorker(value) {
        this._useWorker = value;
    }
    /** Loader manager */
    manager = LoaderFactory.manager;
    /**
     * Load getmetry and materail of tile from x, y and z coordinate.
     *
     * @returns Promise<MeshDateType> tile data
     */
    async load(params) {
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
    unload(tileMesh) {
        const materials = tileMesh.material;
        const geometry = tileMesh.geometry;
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
    async loadGeometry(params) {
        let geometry;
        if (this.demSource &&
            params.z >= this.demSource.minLevel &&
            this._isBoundsInSourceBounds(this.demSource, params.bounds)) {
            const loader = LoaderFactory.getGeometryLoader(this.demSource);
            loader.useWorker = this.useWorker;
            const source = this.demSource;
            geometry = await loader.load({ source, ...params }).catch(_err => {
                console.error("Load material error", source.dataType, params);
                return new PlaneGeometry();
            });
            geometry.addEventListener("dispose", () => {
                loader.unload && loader.unload(geometry);
            });
        }
        else {
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
    async loadMaterial(params) {
        const sources = this.imgSource.filter(source => params.z >= source.minLevel && this._isBoundsInSourceBounds(source, params.bounds));
        const materialsPromise = sources.map(async (source) => {
            const loader = LoaderFactory.getMaterialLoader(source);
            loader.useWorker = this.useWorker;
            const material = await loader.load({ source, ...params }).catch(_err => {
                console.error("Load material error", source.dataType, params);
                return new MeshBasicMaterial();
            });
            const dispose = (evt) => {
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
    _isBoundsInSourceBounds(source, bounds) {
        const sourceBounds = source._projectionBounds;
        const inBounds = !(bounds[2] < sourceBounds[0] ||
            bounds[3] < sourceBounds[1] ||
            bounds[0] > sourceBounds[2] ||
            bounds[1] > sourceBounds[3]); //[minx, miny, maxx, maxy]
        return inBounds;
    }
}
