import { TileMap } from "../../map";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import html from "./compass.html?raw";

declare module "../../map" {
	interface TileMap {
		/**
		 * 添加罗盘
		 * @param controls 控制器
		 */
		createCompass(controls: OrbitControls): Compass;
	}
}

/** 罗盘类 */
export class Compass {
	/** 罗盘顶层dom */
	public dom = document.createElement("div");
	/* 罗盘中的小飞机 */
	public plane: HTMLElement | null | undefined;
	/** 罗盘中的文字 */
	public text: HTMLElement | null | undefined;
	/* 地图控制器 */
	public controls: OrbitControls;
	/**
	 * 构造函数
	 * @param controls 地图控制器
	 */
	public constructor(controls: OrbitControls) {
		this.controls = controls;
		this.dom.innerHTML = html;
		this.dom.style.width = "100%";
		this.dom.style.height = "100%";
		this.plane = this.dom.querySelector<HTMLElement>("#tt-compass-plane");
		this.text = this.dom.querySelector<HTMLElement>("#tt-compass-text");
		// 控制器发生变化时旋转飞机和文字
		controls.addEventListener("change", () => {
			if (this.plane && this.text) {
				this.plane.style.transform = `rotateX(${controls.getPolarAngle()}rad)`;
				this.text.style.transform = `rotate(${controls.getAzimuthalAngle()}rad)`;
			}
		});
	}
}

/** 创建罗盘实例 */
TileMap.prototype.createCompass = function (controls: OrbitControls) {
	return new Compass(controls);
};
