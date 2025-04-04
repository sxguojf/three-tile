import { MapFog } from "./MapFog";
export { MapFog };
export function createFog(controls, fogColor = 0xdbf0ff) {
    return new MapFog(controls, fogColor);
}
