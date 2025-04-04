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
    /** Display opacity */
    opacity?: number;
    bounds?: [number, number, number, number];
    /** Data Url template */
    url?: string;
    /** Url subdomains array or string */
    subdomains?: string[] | string;
    /** Is TMS scheme */
    isTMS?: boolean;
    /** User data */
    userData?: {
        [key: string]: unknown;
    };
}
/**
 *  Base class for data sources, users can customize data sources by inheriting this class
 */
export declare class TileSource implements ISource {
    /** Data type that determines which loader to use for loading and processing data. Default is "image" type */
    dataType: string;
    /** Copyright attribution information for the data source, used for displaying map copyright notices */
    attribution: string;
    /** Minimum zoom level supported by the data source. Default is 0 */
    minLevel: number;
    /** Maximum zoom level supported by the data source. Default is 18 */
    maxLevel: number;
    /** Data projection type. Default is "3857" Mercator projection */
    projectionID: ProjectionType;
    /** URL template for tile data. Uses variables like {x},{y},{z} to construct tile request URLs */
    url: string;
    /** List of URL subdomains for load balancing. Can be an array of strings or a single string */
    subdomains: string[] | string;
    /** Currently used subdomain. Randomly selected from subdomains when requesting tiles */
    s: string;
    /** Layer opacity. Range 0-1, default is 1.0 (completely opaque) */
    opacity: number;
    /** Whether to use TMS tile coordinate system. Default false uses XYZ system, true uses TMS system */
    isTMS: boolean;
    /** Data bounds in format [minLon, minLat, maxLon, maxLat]. Default covers global range excluding polar regions */
    bounds: [number, number, number, number];
    /** Projected data bounds */
    _projectionBounds: [number, number, number, number];
    /** User-defined data. Can store any key-value pairs */
    userData: {
        [key: string]: unknown;
    };
    /**
     * constructor
     * @param options SourceOptions
     */
    constructor(options?: SourceOptions);
    /**
     * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
     * @param x tile x coordinate
     * @param y tile y coordinate
     * @param z tile z coordinate
     * @returns url tile url
     */
    getUrl(x: number, y: number, z: number): string | undefined;
    /**
     * Get url from tile coordinate, public，called by TileLoader
     * @param x tile x coordinate
     * @param y tile y coordinate
     * @param z tile z coordinate
     * @returns url tile url
     */
    _getUrl(x: number, y: number, z: number): string | undefined;
    /**
     * Create source directly through factoy functions.
     * @param options source options
     * @returns ISource data source instance
     */
    static create(options: SourceOptions): TileSource;
}
