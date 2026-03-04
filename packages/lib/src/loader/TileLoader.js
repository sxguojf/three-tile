/**
 *@description: Tile Loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { Mesh, MeshBasicMaterial, Texture } from "three";
import { TileGeometry } from "../geometry";
import { LoaderFactory } from "./LoaderFactory";
import { tileBoundsClip } from "./util";
/**
 * Tile loader
 */
export class TileLoader {
    constructor() {
        this._downloadingThreads = 0;
        /** Map bounds in lonlat, default is world */
        this._bounds = [-180, -85, 180, 85];
        this._maxThreads = 10;
        this._imgSource = [];
        /** Debug single */
        this.debug = 0;
        /** Error material */
        this._errorMaterial = new MeshBasicMaterial({
            color: 0,
            transparent: true,
            opacity: 0.2,
            name: "error-material",
        });
    }
    get bounds() {
        return this._bounds;
    }
    set bounds(value) {
        this._bounds = value;
    }
    /** Get the max downloading threads count*/
    get maxThreads() {
        return this._maxThreads;
    }
    /** Set the max downloading threads count*/
    set maxThreads(value) {
        this._maxThreads = value;
    }
    /** Get downloading threads count*/
    get downloadingThreads() {
        return this._downloadingThreads;
    }
    /** Get image source */
    get imgSource() {
        return this._imgSource;
    }
    /** Set image source */
    set imgSource(value) {
        this._imgSource = value;
    }
    /** Get terrain source */
    get demSource() {
        return this._demSource;
    }
    /** Set terrain source */
    set demSource(value) {
        this._demSource = value;
    }
    /** Get map prjection ID */
    get projectionID() {
        return this.imgSource[0].projectionID;
    }
    /** Loader manager */
    get manager() {
        return LoaderFactory.manager;
    }
    /**
     * Load getmetry and materail of tile from x, y and z coordinate.
     * @param params load params(x,y,z,bounds etc.)
     * @param tileMesh tile mesh
     * @returns Promise<TileMesh> tile mesh
     */
    async load(params) {
        const count = (this.demSource ? 1 : 0) + this.imgSource.length;
        this._downloadingThreads += count;
        let mesh;
        try {
            // load
            const material = await this.loadMaterial(params);
            const geometry = await this.loadGeometry(params);
            // new mesh
            mesh = new Mesh(geometry, material);
            //set material array
            mesh.geometry.clearGroups();
            mesh.material.forEach((_, i) => {
                mesh.geometry.addGroup(0, Infinity, i);
            });
        }
        finally {
            this._downloadingThreads -= count;
        }
        return mesh;
    }
    /**
     * modify tile
     * @param params
     * @param tileMesh
     */
    async update(params, tileMesh) {
        const count = (this.demSource ? 1 : 0) + this.imgSource.length;
        this._downloadingThreads += count;
        try {
            // load
            const material = await this.loadMaterial(params, tileMesh.material);
            const geometry = await this.loadGeometry(params, tileMesh.geometry);
            //set material array
            geometry.clearGroups();
            material.forEach((_, i) => {
                geometry.addGroup(0, Infinity, i);
            });
            // dispose old geometry
            if (geometry != tileMesh.geometry) {
                tileMesh.geometry.dispose();
                delete tileMesh.geometry.userData.source;
            }
            // dispose old material
            tileMesh.material.forEach((mat, i) => {
                if (mat !== this._errorMaterial && mat != material[i]) {
                    mat.dispose();
                    delete mat.userData.source;
                }
            });
            tileMesh.geometry = geometry;
            tileMesh.material = material;
            console.assert(tileMesh.material.length === tileMesh.geometry.groups.length);
        }
        finally {
            this._downloadingThreads -= count;
        }
    }
    /**
     * Load geometry
     * @returns BufferGeometry
     */
    async loadGeometry(params, tileGeometry) {
        // no dem source or out of bounds
        if (!this.demSource || !this._checkBounds(this.demSource, params)) {
            return new TileGeometry();
        }
        // source not changed
        if (tileGeometry && tileGeometry.userData.source === this.demSource) {
            return tileGeometry;
        }
        // get loader
        const loader = LoaderFactory.getGeometryLoader(this.demSource);
        // load geometry
        const geometry = await loader
            .load({ source: this.demSource, ...params })
            .then(geo => {
            geo.userData.source = this.demSource;
            return geo;
        })
            .catch(e => {
            if (this.debug > 0) {
                console.error("Load Geometry Error:", e);
            }
            return new TileGeometry();
        });
        return geometry;
        // return new PlaneGeometry();
    }
    /**
     * Load material
     * @param x x coordinate of tile
     * @param y y coordinate of tile
     * @param z z coordinate of tile
     * @returns Material[]
     */
    async loadMaterial(params, tileMaterial) {
        // result
        const materials = [];
        // visible sources
        const sources = this.imgSource.filter(source => this._checkBounds(source, params));
        for (let i = 0; i < sources.length; i++) {
            const source = sources[i];
            // source not changed
            if (tileMaterial) {
                const oldMaterial = tileMaterial[i];
                if (oldMaterial && source === oldMaterial.userData.source) {
                    materials.push(oldMaterial);
                    continue;
                }
            }
            // load
            const loader = LoaderFactory.getMaterialLoader(source);
            const material = await loader
                .load({ source, ...params })
                .then(mat => {
                mat.userData.source = source;
                return mat;
            })
                .catch(e => {
                if (this.debug > 0) {
                    console.error("Load Material Error:", e.target.src);
                }
                return this._errorMaterial.clone();
            });
            // clip the materilal to map bounds
            this._materialClip(material, source, params);
            materials.push(material);
        }
        return materials;
    }
    /** Clip the material texture from mapBounds */
    _materialClip(material, source, params) {
        if ("map" in material && material.map instanceof Texture) {
            const texture = material.map;
            if (texture.image) {
                texture.image = tileBoundsClip(texture.image, source._projectionBounds, params.bounds);
            }
            texture.needsUpdate = true;
        }
        return this;
    }
    /** Check the tile is in the source bounds. */
    _checkBounds(source, params) {
        const intersectsBounds = (source, tileBounds) => {
            const sourceBounds = source._projectionBounds;
            return (tileBounds[2] >= sourceBounds[0] &&
                tileBounds[3] >= sourceBounds[1] &&
                tileBounds[0] <= sourceBounds[2] &&
                tileBounds[1] <= sourceBounds[3]);
        };
        return params.z >= source.minLevel && intersectsBounds(source, params.bounds);
    }
}
