/**
 *@description: Base Class of data source
 *@author: 郭江峰
 *@date: 2023-04-05
 */
/**
 *  Base class for data sources, users can customize data sources by inheriting this class
 */
export class TileSource {
    /**
     * constructor
     * @param options SourceOptions
     */
    constructor(options) {
        /** Data type that determines which loader to use for loading and processing data. Default is "image" type */
        this.dataType = "image";
        /** Copyright attribution information for the data source, used for displaying map copyright notices */
        this.attribution = "ThreeTile";
        /** Minimum zoom level supported by the data source. Default is 0 */
        this.minLevel = 0;
        /** Maximum zoom level supported by the data source. Default is 18 */
        this.maxLevel = 18;
        /** Data projection type. Default is "3857" Mercator projection */
        this.projectionID = "3857";
        /** URL template for tile data. Uses variables like {x},{y},{z} to construct tile request URLs */
        this.url = "";
        /** List of URL subdomains for load balancing. Can be an array of strings or a single string */
        this.subdomains = [];
        /** material opacity. Range 0-1, default is 1.0 (completely opaque) */
        this.opacity = 1.0;
        /** Whether the material is transparent. Default is true (transparent) */
        this.transparent = true;
        /** Whether to use TMS tile coordinate system. Default false uses XYZ system, true uses TMS system */
        this.isTMS = false;
        /** Projected data bounds */
        this._projectionBounds = [-Infinity, -Infinity, Infinity, Infinity];
        Object.assign(this, options);
    }
    _getBBox(x, y, z) {
        const worldSize = Math.PI * 6378137;
        const tileSize = (2 * worldSize) / Math.pow(2, z);
        const minX = -worldSize + x * tileSize;
        const minY = worldSize - (y + 1) * tileSize;
        const maxX = -worldSize + (x + 1) * tileSize;
        const maxY = worldSize - y * tileSize;
        return `${minX},${minY},${maxX},${maxY}`;
    }
    /**
     * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
     * @param x tile x coordinate
     * @param y tile y coordinate
     * @param z tile z coordinate
     * @returns url tile url
     */
    getUrl(x, y, z, obj) {
        // get subdomains random
        const subLen = this.subdomains.length;
        let s;
        if (subLen > 0) {
            const index = Math.floor(Math.random() * subLen);
            s = this.subdomains[index];
        }
        const bbox = this._getBBox(x, y, z);
        // reverse y coordinate if TMS scheme
        y = this.isTMS ? Math.pow(2, z) - 1 - y : y;
        const data = { ...this, ...{ x, y, z, s, bbox }, ...obj };
        return strTemplate(this.url, data);
    }
    /**
     * Get url from tile coordinate, public，called by TileLoader
     * @param x tile x coordinate
     * @param y tile y coordinate
     * @param z tile z coordinate
     * @returns url tile url
     */
    // public _getUrl(x: number, y: number, z: number): string | undefined {
    // 	// reverse y coordinate if TMS scheme
    // 	const reverseY = this.isTMS ? Math.pow(2, z) - 1 - y : y;
    // 	return this.getUrl(x, reverseY, z);
    // }
    /**
     * Create source directly through factoy functions.
     * @param options source options
     * @returns ISource data source instance
     */
    static create(options) {
        return new TileSource(options);
    }
}
// https://github.com/Leaflet/Leaflet/blob/main/src/core/Util.js
// @function template(str: String, data: Object): String
// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
// `('Hello foo, bar')`. You can also specify functions instead of strings for
// data values — they will be evaluated passing `data` as an argument.
export function strTemplate(str, data) {
    const templateRe = /\{ *([\w_-]+) *\}/g;
    return str.replace(templateRe, (str, key) => {
        const value = data[key] ??
            (() => {
                throw new Error(`source url template error, No value provided for variable: ${str}`);
            })();
        return typeof value === "function" ? value(data) : value;
    });
}
