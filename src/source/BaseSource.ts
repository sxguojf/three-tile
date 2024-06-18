import { ColorSpace } from "three";

/**
 * a callback function for conver tile x/y/z to url
 */
export interface SourceUrlFunc {
	(x: number, y: number, z: number): string | undefined;
}

/** Project ID */
type ProjectionType = "3857" | "4326";

/**
 * Source interface
 * all source implements ISource get url from x/y/z coordinate to url
 */
export interface ISource {
	dataType: string; // a string identifies the source data type, it requires the support of the loader.
	attribution: string; // source attribution, it allows you to display attribution data
	minLevel: number; // data min level
	maxLevel: number; // data max level
	projection: ProjectionType; // data projection
	colorSpace: ColorSpace; // color space (threejs)
	opacity: number; // display opacity
	bounds: [number, number, number, number]; // data bounds, not yet completed.

	getTileUrl: SourceUrlFunc; // get url from  xyz
	onGetUrl?: (x: number, y: number, z: number) => { x: number; y: number; z: number }; // get new xyz from orgin xyz
}

/**
 * source construtor params type
 */
export type SourceOptions = {
	dataType?: string;
	attribution?: string;
	minLevel?: number;
	maxLevel?: number;
	projection?: string;
	colorSpace?: ColorSpace;
	opacity?: number;
	bounds?: [number, number, number, number];
	url?: SourceUrlFunc | string;
	subdomains?: string[] | string;
	[name: string]: any;
};

/**
 * base source class, custom source can inherit from it
 */
export class BaseSource implements ISource {
	public dataType = "image";
	public attribution = "ThreeTile";
	public minLevel = 0;
	public maxLevel = 19;
	public projection: ProjectionType = "3857";
	public url = "";
	protected subdomains: string[] | string = [];
	protected s: string = "";
	public colorSpace: ColorSpace = "srgb";
	public opacity: number = 1.0;
	public bounds: [number, number, number, number] = [-180, 85.05112877980659, 180, -85.05112877980659];

	[name: string]: any;

	/**
	 * get url callback function, overwrite it to convt orgin xyz to new xzy
	 */
	public onGetUrl?: ((x: number, y: number, z: number) => { x: number; y: number; z: number }) | undefined;

	/**
	 * constructor
	 * @param options
	 */
	constructor(options?: SourceOptions) {
		if (options) {
			Object.assign(this, options);
			if (options.url instanceof Function) {
				this.getUrl = options.url;
			} else {
				this.url = options.url || "";
			}
		}
	}

	/**
	 * get url from tile coordinate, public，called by TileLoader
	 * @param x
	 * @param y
	 * @param z
	 * @returns url
	 */
	public getTileUrl(x: number, y: number, z: number) {
		// get subdomains random
		const subLen = this.subdomains.length;
		if (subLen > 0) {
			const index = Math.floor(Math.random() * subLen);
			this.s = this.subdomains[index];
		}
		const coord = this.onGetUrl ? this.onGetUrl(x, y, z) : { x, y, z };
		if (coord) {
			return this.getUrl(coord.x, coord.y, coord.z);
		} else {
			return undefined;
		}
	}

	/**
	 * get url from tile coordinate, protected, overwrite to custom generation tile url from xyz
	 * @param x
	 * @param y
	 * @param z
	 * @returns url
	 */
	protected getUrl(x: number, y: number, z: number): string | undefined {
		if (this.url) {
			const obj = Object.assign({}, this, { x, y, z });
			return strTemplate(this.url, obj);
		}
		return undefined;
	}

	/**
	 * source factory function, create source directly through factoy functions.
	 * @param options
	 * @returns ISource
	 */
	public static create(options: SourceOptions) {
		return new BaseSource(options);
	}
}

// https://github.com/Leaflet/Leaflet/blob/main/src/core/Util.js
// @function template(str: String, data: Object): String
// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
// `('Hello foo, bar')`. You can also specify functions instead of strings for
// data values — they will be evaluated passing `data` as an argument.
function strTemplate(str: string, data: { [name: string]: any }) {
	const templateRe = /\{ *([\w_ -]+) *\}/g;
	return str.replace(templateRe, (str, key) => {
		let value = data[key];
		if (value === undefined) {
			throw new Error(`source url template error, No value provided for variable: ${str}`);
		} else if (typeof value === "function") {
			value = value(data);
		}
		return value;
	});
}
