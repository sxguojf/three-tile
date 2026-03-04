/**
 *@description: 地图瓦片加载器，完成加载前对瓦片坐标、投影范围的预处理
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { TileLoader } from "../loader";
import { ProjMCT } from "./projection";
/** 地图瓦片加载器，ITileLoader基础上增加地图投影属性 */
export class TileMapLoader extends TileLoader {
    constructor() {
        super();
        this._projection = new ProjMCT(0);
        console.log(this);
    }
    get imgSource() {
        return super.imgSource;
    }
    set imgSource(source) {
        super.imgSource = source;
        // 计算source的投影范围
        this._updateImgProjBounds();
    }
    get demSource() {
        return super.demSource;
    }
    set demSource(source) {
        super.demSource = source;
        // 计算source的投影范围
        this._updateDemPrjBounds();
    }
    set bounds(value) {
        this.bounds = value;
        this._updateImgProjBounds();
        this._updateDemPrjBounds();
    }
    get bounds() {
        return super.bounds;
    }
    _updateImgProjBounds() {
        const proj = this._projection;
        // 计算数据源投影范围
        super.imgSource.forEach(source => {
            source._projectionBounds = proj.getProjBoundsFromLonLat(source.bounds || this.bounds);
        });
    }
    _updateDemPrjBounds() {
        const proj = this._projection;
        if (this.demSource) {
            // 计算数据源投影范围
            this.demSource._projectionBounds = proj.getProjBoundsFromLonLat(this.demSource.bounds || this.bounds);
        }
    }
    get projection() {
        return this._projection;
    }
    set projection(projection) {
        this._projection = projection;
        // 更新source的投影范围
        this._updateImgProjBounds();
        this._updateDemPrjBounds();
    }
    async load(params) {
        return super.load(this._getTileCoords(params));
    }
    async update(coord, tileMesh) {
        super.update(this._getTileCoords(coord), tileMesh);
    }
    _getTileCoords(params) {
        if (!this._projection) {
            throw new Error("projection is undefined");
        }
        const { x, y, z } = params;
        // 计算投影后的瓦片x坐标
        const newX = this._projection.getTileXWithCenterLon(x, z);
        // 计算瓦片投影范围
        const bounds = this._projection.getProjBoundsFromXYZ(x, y, z);
        // 计算瓦片经纬度范围
        const lonLatBounds = this._projection.getLonLatBoundsFromXYZ(x, y, z);
        return { x: newX, y, z, bounds, lonLatBounds };
    }
}
