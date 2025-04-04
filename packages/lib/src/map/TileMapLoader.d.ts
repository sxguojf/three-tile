/**
 *@description: 地图瓦片加载器，完成加载前对瓦片坐标、投影范围的预处理
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { ITileLoader, MeshDateType, TileLoader, TileLoadParamsType } from "../loader";
import { IProjection } from "./projection";
/** 地图瓦片加载器 */
export declare class TileMapLoader extends TileLoader {
    private _projection;
    attcth(loader: ITileLoader, projection: IProjection): void;
    load(params: TileLoadParamsType): Promise<MeshDateType>;
}
