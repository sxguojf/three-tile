// type Style = "img_w" | "cia_w" | "cva_w" | "ibo_w" | "ter_w" | "vec_w";

import { BaseSource, SourceOptions } from "../../source/BaseSource";

type Style = "img_w" | "cia_w" | "cva_w" | "ibo_w" | "ter_w" | "vec_w" | "cta_w" | "img_c" | "cia_c";

export type TDTSourceOptins = SourceOptions & {
	style?: Style;
	token: string;
};

/**
 * TianDiTu datasource
 */
export class TDTSource extends BaseSource {
	public dataType: string = "image";
	public attribution = "天地图[GS(2023)336号]";
	public token: string = "";
	public style: Style = "img_w";
	public subdomains = "01234";
	public url = "https://t{s}.tianditu.gov.cn/DataServer?T={style}&x={x}&y={y}&l={z}&tk={token}";

	constructor(options?: TDTSourceOptins) {
		super(options);
		Object.assign(this, options);
	}
}
