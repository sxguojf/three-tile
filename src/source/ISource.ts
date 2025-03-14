/**
 *@description: Interface of map source
 *@author: 郭江峰
 *@date: 2023-04-05
 */

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
	/** is TMS scheme */
	isTMS?: boolean;
	/* Data bounds in lonlat [minLon,minLat,maxLon,maxLat]*/
	bounds: [number, number, number, number];
	/** Data bounds in Proejction, internal use */
	_projectionBounds: [number, number, number, number];
	getUrl(x: number, y: number, z: number): string | undefined;
	/** Get url from xyz, internal use */
	_convertXYZ: (x: number, y: number, z: number) => { x: number; y: number; z: number };
	/** Get the tile bounds , internal use*/
	_getTileBounds(x: number, y: number, z: number): [number, number, number, number];
	useData: { [key: string]: any };
}
