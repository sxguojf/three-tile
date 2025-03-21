/**
 *@description: Utils for loader
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { ISource } from "../source";
/**
 * Get bounds to clip image
 * @param clipBounds bounds [minx,miny,maxx,maxy],0-1
 * @param targetSize size to scale
 * @returns startX,StarY,width,height
 */
export declare function getBoundsCoord(clipBounds: [number, number, number, number], targetSize: number): {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
};
/**
 * Get url and rect for max level tile
 * to load greater than max level from source,  had to load from max level.
 * 因为瓦片数据并未覆盖所有级别瓦片，如MapBox地形瓦片最高只到15级，如果要显示18级以上瓦片，不能从17级瓦片中获取，只能从15级瓦片里截取一部分
 * @param source
 * @param tile
 * @returns max tile url and bounds in  in maxTile
 */
export declare function getSafeTileUrlAndBounds(source: ISource, x: number, y: number, z: number): {
    url: string | undefined;
    clipBounds: [number, number, number, number];
};
