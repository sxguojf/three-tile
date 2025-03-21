/**
 *@description: Debug material laoder
 *@author: 郭江峰
 *@date: 2023-04-06
 */
import { TileSourceLoadParamsType } from "../../loader";
import { TileCanvasLoader } from "../../loader/TileCanvasLoader";
/**
 * Debug material laoder, it draw a rectangle and coordinate on the tile
 */
export declare class TileMaterialDebugeLoader extends TileCanvasLoader {
    /** Loader info */
    readonly info: {
        version: string;
        description: string;
    };
    /** Source data type */
    readonly dataType = "debug";
    /**
     * Draw tile on canvas
     * @param ctx Tile canvas context
     * @param params Tile load params
     */
    protected drawTile(ctx: OffscreenCanvasRenderingContext2D, params: TileSourceLoadParamsType): void;
}
