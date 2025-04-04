import { TileSource } from "three-tile";
/**
 *  ArcGis datasource
 */
export class ArcGisSource extends TileSource {
    dataType = "image";
    attribution = "ArcGIS";
    style = "World_Imagery";
    url = "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
/**
 * ArcGis terrain datasource
 */
export class ArcGisDemSource extends TileSource {
    dataType = "lerc";
    attribution = "ArcGIS";
    minLevel = 6;
    maxLevel = 13;
    url = "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
