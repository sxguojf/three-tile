/**
 *@description: Base Class of data source
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { ProjectionType, ISource } from "./ISource";

/**
 * source construtor params type
 */
export interface SourceOptions {
	/** A string identifies the source data type, it requires the support of the loader. */
	dataType?: string;
	/** Source attribution info, it allows you to display attribution*/
	attribution?: string;
	/** Data max level */
	minLevel?: number;
	/** Data min level */
	maxLevel?: number;
	/** Data projection */
	projectionID?: ProjectionType;
	/** Material opacity */
	opacity?: number;
	/** Material transparent */
	transparent?: boolean;
	/* Data bounds， */
	bounds?: [number, number, number, number];
	/** Data Url template */
	url?: string;
	/** Url subdomains array or string */
	subdomains?: string[] | string;
	/** Is TMS scheme */
	isTMS?: boolean;
	/** Any data */
	[key: string]: unknown;
}

/**
 *  Base class for data sources, users can customize data sources by inheriting this class
 */
export class TileSource implements ISource {
	/** Data type that determines which loader to use for loading and processing data. Default is "image" type */
	public dataType = "image";
	/** Copyright attribution information for the data source, used for displaying map copyright notices */
	public attribution = "ThreeTile";
	/** Minimum zoom level supported by the data source. Default is 0 */
	public minLevel = 0;
	/** Maximum zoom level supported by the data source. Default is 18 */
	public maxLevel = 18;
	/** Data projection type. Default is "3857" Mercator projection */
	public projectionID: ProjectionType = "3857";
	/** URL template for tile data. Uses variables like {x},{y},{z} to construct tile request URLs */
	public url = "";
	/** List of URL subdomains for load balancing. Can be an array of strings or a single string */
	public subdomains: string[] | string = [];
	/** Currently used subdomain. Randomly selected from subdomains when requesting tiles */
	public s: string = "";
	/** material opacity. Range 0-1, default is 1.0 (completely opaque) */
	public opacity: number = 1.0;
	/** Whether the material is transparent. Default is true (transparent) */
	public transparent: boolean = true;
	/** Whether to use TMS tile coordinate system. Default false uses XYZ system, true uses TMS system */
	public isTMS = false;
	/** Data bounds in format [minLon, minLat, maxLon, maxLat]. Default is undefined */
	public bounds?: [number, number, number, number]; // = [-180, -85, 180, 85];
	/** Projected data bounds */
	public _projectionBounds: [number, number, number, number] = [-Infinity, -Infinity, Infinity, Infinity];
	/** Any data */
	[key: string]: unknown;
	/**
	 * constructor
	 * @param options SourceOptions
	 */
	constructor(options?: SourceOptions) {
		Object.assign(this, options);
	}

	/**
	 * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
	 * @param x tile x coordinate
	 * @param y tile y coordinate
	 * @param z tile z coordinate
	 * @returns url tile url
	 */
	public getUrl(x: number, y: number, z: number): string | undefined {
		const obj = { ...this, ...{ x, y, z } };
		return strTemplate(this.url, obj);
	}

	/**
	 * Get url from tile coordinate, public，called by TileLoader
	 * @param x tile x coordinate
	 * @param y tile y coordinate
	 * @param z tile z coordinate
	 * @returns url tile url
	 */
	public _getUrl(x: number, y: number, z: number): string | undefined {
		// get subdomains random
		const subLen = this.subdomains.length;
		if (subLen > 0) {
			const index = Math.floor(Math.random() * subLen);
			this.s = this.subdomains[index];
		}
		// reverse y coordinate if TMS scheme
		const reverseY = this.isTMS ? Math.pow(2, z) - 1 - y : y;
		return this.getUrl(x, reverseY, z);
	}

	/**
	 * Create source directly through factoy functions.
	 * @param options source options
	 * @returns ISource data source instance
	 */
	public static create(options: SourceOptions) {
		return new TileSource(options);
	}
}

// https://github.com/Leaflet/Leaflet/blob/main/src/core/Util.js
// @function template(str: String, data: Object): String
// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
// `('Hello foo, bar')`. You can also specify functions instead of strings for
// data values — they will be evaluated passing `data` as an argument.
export function strTemplate(str: string, data: { [name: string]: any }) {
	const templateRe = /\{ *([\w_-]+) *\}/g;
	return str.replace(templateRe, (str, key) => {
		const value =
			data[key] ??
			(() => {
				throw new Error(`source url template error, No value provided for variable: ${str}`);
			})();
		return typeof value === "function" ? value(data) : value;
	});
}
