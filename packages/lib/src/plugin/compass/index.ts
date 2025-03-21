import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Compass } from "./Compass";
export { Compass };

/** 创建罗盘实例 */
export function createCompass(controls: OrbitControls): Compass {
	return new Compass(controls);
}
