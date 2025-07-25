import * as tt from "three-tile";
import * as CryptoJS from "crypto-js";
export class JL1Source extends tt.TileSource {
	public isTMS: boolean = true;
	public attribution: string = "吉林1号";
	public getUrl(x: number, y: number, z: number): string | undefined {
		const url = super.getUrl(x, y, z);
		if (url) {
			const CG_URL_SK_GLOBAL = "7dd95af8f44f1a8a41dcb9e3c0cdd3e1";
			const s = url.substring(url.indexOf("/getMap")) + CG_URL_SK_GLOBAL;
			const sign = CryptoJS.MD5(s).toString();
			return `${url}&sign=${sign}`;
		} else {
			return url;
		}
	}
}
