/**
 *@description: Map background material loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */

import { MeshBasicMaterial } from "three";
import { ITileMaterial, TileMaterialLoader, TileSourceLoadParamsType, version } from "three-tile";
import { BackgroundSource } from "./backgroundSource";

/**
 * 地图背景加载器
 */
export class BackgroundLoader extends TileMaterialLoader {
	public info = {
		version,
		description: "Map background material loader",
	};

	public dataType = "background";

	public createMaterial(params: TileSourceLoadParamsType<BackgroundSource>): ITileMaterial {
		return new MeshBasicMaterial({ color: params.source.color });
	}
}
