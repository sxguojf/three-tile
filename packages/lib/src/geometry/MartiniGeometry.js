/**
 *@description: Tile Geometry
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { BufferAttribute } from "three";
import { addSkirt } from "./skirt";
import { TileGeometry } from "./TileGeometry";
import { getGeometryDataFromDem } from "./utils";
// import { Martini } from "./Martini";
/**
 * Tile geometry
 */
export class MartiniGeometry extends TileGeometry {
    constructor() {
        super(...arguments);
        this.type = "MartiniGeometry";
        // public martini(dem: Float32Array, skirtHeight: number = 1000) {
        // 	const gridSize = Math.sqrt(dem.length);
        // 	// 构建Martin
        // 	const martini = new Martini(gridSize);
        // 	// 简化
        // 	const tile = martini.createTile(dem);
        // 	// 几何误差
        // 	const maxError = maxErrors[z] || 0;
        // 	// 返回Geometry数据
        // 	return tile.getGeometryData(maxError);
        // }
    }
    /**
     * set attribute data to geometry
     * @param data geometry or DEM data
     * @returns this
     */
    setAttribes(data, skirtHeight = 1000) {
        // Get geometry attriibutes and indices
        const geoData = data instanceof Float32Array ? getGeometryDataFromDem(data) : data;
        // Add a skirt to the geometry
        const geoDataWithSkirt = addSkirt(geoData.attributes, geoData.indices, skirtHeight);
        const { attributes, indices } = geoDataWithSkirt;
        this.setIndex(new BufferAttribute(indices, 1));
        this.setAttribute("position", new BufferAttribute(attributes.position.value, attributes.position.size));
        this.setAttribute("uv", new BufferAttribute(attributes.texcoord.value, attributes.texcoord.size));
        this.setAttribute("normal", new BufferAttribute(attributes.normal.value, attributes.normal.size));
        // 感觉加上这两句速度会快一点, 幻觉?
        // this.computeBoundingBox();
        // this.computeBoundingSphere();
        return this;
    }
}
