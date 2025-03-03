import { TileMap } from "./TileMap";

export interface IPlugin {
	install(map: TileMap, options: any): Promise<void>;
}
