import html from "./compass.html?raw";
/** 罗盘类 */
export class Compass {
    /** 罗盘顶层dom */
    dom = document.createElement("div");
    /* 罗盘中的小飞机 */
    plane;
    /** 罗盘中的文字 */
    text;
    /* 地图控制器 */
    controls;
    /**
     * 构造函数
     * @param controls 地图控制器
     */
    constructor(controls) {
        this.controls = controls;
        this.dom.innerHTML = html;
        this.dom.style.width = "100%";
        this.dom.style.height = "100%";
        this.plane = this.dom.querySelector("#tt-compass-plane");
        this.text = this.dom.querySelector("#tt-compass-text");
        // 控制器发生变化时旋转飞机和文字
        controls.addEventListener("change", () => {
            if (this.plane && this.text) {
                this.plane.style.transform = `rotateX(${controls.getPolarAngle()}rad)`;
                this.text.style.transform = `rotate(${controls.getAzimuthalAngle()}rad)`;
            }
        });
        this.dom.onclick = () => open("https://github.com/sxguojf/three-tile");
    }
}
