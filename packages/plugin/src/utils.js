import { Vector2, Vector3 } from "three";
export function getLocalFromMouse(pointerEvent, map, camera) {
    const { currentTarget: target, clientX: x, clientY: y } = pointerEvent;
    if (target instanceof HTMLElement) {
        const width = target.clientWidth;
        const height = target.clientHeight;
        const pointer = new Vector2((x / width) * 2 - 1, -(y / height) * 2 + 1);
        const info = map.getLocalInfoFromScreen(camera, pointer);
        return info?.location;
    }
    else {
        return undefined;
    }
}
export function getAttributions(map) {
    const attributions = new Set();
    const imgSources = Array.isArray(map.imgSource) ? map.imgSource : [map.imgSource];
    imgSources.forEach(source => {
        const attr = source.attribution;
        attr && attributions.add(attr);
    });
    if (map.demSource) {
        const attr = map.demSource.attribution;
        attr && attributions.add(attr);
    }
    return Array.from(attributions);
}
export function limitCameraHeight(map, camera, limitHeight = 0.1) {
    // 摄像机方向与近截面交点的世界坐标
    const checkPoint = camera.localToWorld(new Vector3(0, 0, -camera.near - 0.1));
    // 取该点下方的地面高度
    const info = map.getLocalInfoFromWorld(checkPoint);
    if (info) {
        // 地面高度与该点高度差(世界坐标系下)
        const h = checkPoint.y - info.point.y;
        // 距离低于限制高度时，沿天顶方向抬高摄像机
        if (h < limitHeight) {
            const offset = h < 0 ? -h * 1.1 : h / 10;
            const dv = map.localToWorld(map.up.clone()).multiplyScalar(offset);
            camera.position.add(dv);
            return true;
        }
    }
    return false;
}
