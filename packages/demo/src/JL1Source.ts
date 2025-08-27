import * as tt from "three-tile";
import CryptoJS from "crypto-js";
export class JL1Source extends tt.TileSource {
	public maxLevel: number = 18;
	public isTMS: boolean = true;
	public attribution: string = "吉林1号";
	public mk = "2d9bf902749f1630bc25fc720ba7c29f";
	public tk = "6a1976c931d388deb9980e6aa81fb842";
	public sk = "7dd95af8f44f1a8a41dcb9e3c0cdd3e1";

	//url: "https://api.jl1mall.com/getMap/{z}/{x}/{y}?mk=2d9bf902749f1630bc25fc720ba7c29f&tk=6a1976c931d388deb9980e6aa81fb842",
	public getUrl(x: number, y: number, z: number): string | undefined {
		const url = super.getUrl(x, y, z);
		if (url) {
			const mktk = `?mk=${this.mk}&tk=${this.tk}`;
			const s = `${url.substring(url.indexOf("/getMap"))}${mktk}${this.sk}`;
			const sign = CryptoJS.MD5(s).toString();
			return `${url}${mktk}&sign=${sign}`;
		}
		return url;
	}
}
