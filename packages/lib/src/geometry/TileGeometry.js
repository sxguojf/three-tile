/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { BufferAttribute, PlaneGeometry } from "three";
import { addSkirt } from "./skirt";
import { getGeometryDataFromDem } from "./utils";
/**
 * Inherit of PlaneGeometry, add setData and setDEM method
 */
export class TileGeometry extends PlaneGeometry {
    type = "TileGeometry";
    /**
     * set attribute data to geometry
     * @param data geometry data
     * @returns this
     */
    setData(data) {
        if (data instanceof Float32Array) {
            data = getGeometryDataFromDem(data, true);
        }
        data = addSkirt(data.attributes, data.indices, 10);
        this.setIndex(new BufferAttribute(data.indices, 1));
        const { attributes } = data;
        this.setAttribute("position", new BufferAttribute(attributes.position.value, attributes.position.size));
        this.setAttribute("uv", new BufferAttribute(attributes.texcoord.value, attributes.texcoord.size));
        this.setAttribute("normal", new BufferAttribute(attributes.normal.value, attributes.normal.size));
        // 感觉加上这两句速度会快一点, 幻觉?
        this.computeBoundingBox();
        this.computeBoundingSphere();
        return this;
    }
}
