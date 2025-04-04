/**
 * @description: TileMap 事件类型定义
 * @author: 郭江峰
 * @date: 2023-04-06
 */
import { BaseEvent } from "three";
export interface TileMapEventMap {
    "loading-start": BaseEvent & {
        url: string;
        itemsLoaded: number;
        itemsTotal: number;
    };
    "loading-progress": BaseEvent & {
        url: string;
        itemsLoaded: number;
        itemsTotal: number;
    };
    "loading-complete": BaseEvent & {
        url: string;
        itemsLoaded: number;
        itemsTotal: number;
    };
    "loading-error": BaseEvent & {
        url: string;
        itemsLoaded: number;
        itemsTotal: number;
    };
}
