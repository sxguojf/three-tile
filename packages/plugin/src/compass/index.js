import { Compass } from "./Compass";
export { Compass };
/** 创建罗盘实例 */
export function createCompass(controls) {
    return new Compass(controls);
}
