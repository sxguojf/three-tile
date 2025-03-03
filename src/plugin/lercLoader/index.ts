/**
 *@description: Plugin of ArcGis-Lerc tile geometry loader
 *@author: 郭江峰
 *@date: 2023-04-05
 */

import { LoaderFactory } from "../../loader/LoaderFactory";
import { TileGeometryLercLoader } from "./TileGeometryLercLoader";
import { IPlugin, TileMap } from "../../map";

class Lerc implements IPlugin {
	install(_map: TileMap, _options: any[]): Promise<void> {
		LoaderFactory.registerGeometryLoader(new TileGeometryLercLoader());
		return Promise.resolve();
	}
}

export const lerc = new Lerc();
