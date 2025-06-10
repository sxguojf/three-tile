/**
 * @description: TileMap 事件类型定义
 * @author: 郭江峰
 * @date: 2023-04-06
 */

import { BaseEvent, Object3DEventMap } from "three";
import { Tile } from "../tile";
import { ISource } from "../source";
import { IProjection } from "./projection";

export interface TileMapEventMap extends Object3DEventMap {
	update: BaseEvent & { delta: number };
	ready: BaseEvent;
	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };
	"tile-unload": BaseEvent & { tile: Tile };
	"tile-visible-changed": BaseEvent & { tile: Tile; visible: boolean };

	"projection-changed": BaseEvent & { projection: IProjection };
	"source-changed": BaseEvent & { source: ISource | ISource[] | undefined };

	"loading-start": BaseEvent & { itemsLoaded: number; itemsTotal: number };
	"loading-error": BaseEvent & { url: string };
	"loading-complete": BaseEvent;
	"loading-progress": BaseEvent & { url: string; itemsLoaded: number; itemsTotal: number };

	"parsing-end": BaseEvent & { url: string };
}
