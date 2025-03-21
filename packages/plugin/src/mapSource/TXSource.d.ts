import { TileSource, SourceOptions } from "../tt";
export type TXSourceOptins = SourceOptions & {
	style?: string;
};
/** Tencent datasource */
export declare class TXSource extends TileSource {
	dataType: string;
	style: string;
	attribution: string;
	subdomains: string;
	maxLevel: number;
	isTMS: boolean;
	sx: number;
	sy: number;
	url: string;
	constructor(options?: TXSourceOptins);
	_getUrl(x: number, y: number, z: number): string | undefined;
}
