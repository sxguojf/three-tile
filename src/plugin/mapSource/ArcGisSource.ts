import { BaseSource, SourceOptions } from "../../source/BaseSource";

export type ArcGisSourceOptions = SourceOptions & { style?: string };
/**
 *  ArcGis datasource
 */
export class ArcGisSource extends BaseSource {
	public dataType: string = "image";
	public attribution = "ArcGIS";
	public style = "World_Imagery";
	public url = "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}";
	constructor(options?: ArcGisSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}

/**
 * ArcGis terrain datasource
 */
export class ArcGisDemSource extends BaseSource {
	public dataType: string = "lerc";
	public attribution = "ArcGIS";
	public maxLevel = 13;
	public url =
		"https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}";
	constructor(options?: SourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}
