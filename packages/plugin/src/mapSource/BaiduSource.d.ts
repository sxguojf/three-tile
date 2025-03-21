import { TileSource, SourceOptions } from "../tt";
/**
 * Baidu datasource
 */
export declare class BaiduSource extends TileSource {
	dataType: string;
	attribution: string;
	style: string;
	constructor(style?: string, options?: SourceOptions);
	getUrl(x: number, y: number, z: number): string;
}
