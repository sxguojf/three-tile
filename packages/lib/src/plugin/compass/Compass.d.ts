import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
/** 罗盘类 */
export declare class Compass {
    /** 罗盘顶层dom */
    dom: HTMLDivElement;
    plane: HTMLElement | null | undefined;
    /** 罗盘中的文字 */
    text: HTMLElement | null | undefined;
    controls: OrbitControls;
    /**
     * 构造函数
     * @param controls 地图控制器
     */
    constructor(controls: OrbitControls);
}
