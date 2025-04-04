/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { PlaneGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";
/**
 * Inherit of PlaneGeometry, add setData and setDEM method
 */
export declare class TileGeometry extends PlaneGeometry {
    readonly type = "TileGeometry";
    /**
     * set attribute data to geometry
     * @param data geometry data
     * @returns this
     */
    setData(data: GeometryDataType | Float32Array): this;
}
