/**
 *@description: Martini, base https://github.com/mapbox/martini.
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { GeometryDataType } from ".";
/**
 * Martini mesh tile generator (Mapbox's Awesome Right-Triangulated Irregular Networks, Improved).
 *
 * Represents a height map tile node using the RTIN method from the paper "Right Triangulated Irregular Networks".
 *
 * Based off the library https://github.com/mapbox/martini.
 */
export declare class Martini {
    /**
     * Size of the grid to be generated.
     */
    gridSize: number;
    /**
     * Number of triangles to be used in the tile.
     */
    numTriangles: number;
    /**
     * Number of triangles in the parent node.
     */
    numParentTriangles: number;
    /**
     * Indices of the triangles faces.
     */
    indices: Uint32Array;
    /**
     * Coordinates of the points composing the mesh.
     */
    coords: Uint16Array;
    /**
     * Constructor for the generator.
     *
     * @param gridSize - Size of the grid.
     */
    constructor(gridSize?: number);
    createTile(terrain: Float32Array): MartiniTile;
}
/**
 * Class describes the generation of a tile using the Martini method.
 */
declare class MartiniTile {
    /**
     * Pointer to the martini generator object.
     */
    martini: Martini;
    /**
     * Terrain to generate the tile for.
     */
    terrain: Float32Array;
    /**
     * Errors detected while creating the tile.
     */
    errors: Float32Array;
    constructor(terrain: Float32Array, martini: Martini);
    update(): void;
    getGeometryData(maxError?: number): GeometryDataType;
    private _getMeshAttributes;
}
export {};
