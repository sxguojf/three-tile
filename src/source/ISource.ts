/** Project ID */
export type ProjectionType = "3857" | "4326";
/**
 * Source interface
 * all source implements ISource get url from x/y/z coordinate to url
 */

export interface ISource {
	/** A string identifies the source data type, it requires the support of the loader. */
	dataType: string;
	/** Source attribution info, it allows you to display attribution*/
	attribution: string;
	/** Data max level */
	minLevel: number;
	/** Data min level */
	maxLevel: number;
	/** Data projection */
	projectionID: ProjectionType;
	/** Display opacity */
	opacity: number;
	/* Data bounds in lonlat, Only be loaded inside the lonlats*/
	bounds: [number, number, number, number];
	/** get url from xyz */
	getTileUrl: (x: number, y: number, z: number) => string | undefined;
}
