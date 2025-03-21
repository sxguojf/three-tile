/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { BufferGeometry } from "three";
import { GeometryDataType } from "./GeometryDataTypes";
/**
 * Inherit of PlaneGeometry, add setData and setDEM method
 */
export declare class TileGeometry extends BufferGeometry {
    readonly type = "TileGeometry";
    /**
     * set attribute data to geometry
     * @param geometryData geometry data
     * @returns this
     */
    setData(geometryData: GeometryDataType): this;
    /**
     * set DEM data to geometry
     *
     * @param dem Float32Array类型，表示地形高度图数据
     * @returns 返回设置地形高度图数据后的对象
     */
    setDEM(dem: Float32Array): this;
}
